import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { generateSecret, generateURI, verify } from 'otplib';
import * as qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from './repositories/users.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { comparePassword, hashPassword } from '../../common/utils/hash.util';
import { successResponse } from 'src/common/helpers/response.helper';
import { CacheService } from 'src/config/redis/cache.service';
import { REDIS_KEYS } from 'src/config/redis/redis.keys';
import { CACHE_TTL } from 'src/config/redis/redis.ttl';
import { S3Service } from 'src/config/s3/s3.service';
import { EmailService } from 'src/jobs/email/email.service';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly s3Service: S3Service,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.toLowerCase().trim();

    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const existingUsername = await this.usersRepository.findByUsername(
      registerDto.username,
    );

    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await hashPassword(registerDto.password);

    const user = await this.usersRepository.create({
      firstname: registerDto.firstname,
      lastname: registerDto.lastname,
      username: registerDto.username,
      email,
      password: hashedPassword,
    });

    // Redis Email Verification Token
    const verificationToken = uuidv4();
    const verifyTokenKey = `email-verification:${verificationToken}`;
    await this.cacheService.set(verifyTokenKey, user.id, 86400); // 24 hours TTL

    const { password, refreshToken, ...safeUser } = user;

    await this.cacheService.del(REDIS_KEYS.USER(user.id));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(user.id));

    const verifyLink = `${
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'
    }/verify-email?token=${verificationToken}`;

    await this.emailService.sendVerifyEmail(user.email, user.firstname, verifyLink);

    return successResponse(
      'Registration successful. Please verify your email.',
      {
        user: safeUser,
      },
      HttpStatus.CREATED,
    );
  }

  async login(loginDto: LoginDto) {
    const email = loginDto.email.toLowerCase().trim();

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Account Lockout check
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is locked. Try again in 15 minutes.');
    }

    const isPasswordMatched = await comparePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      const failedAttempts = user.failedAttempts + 1;
      const updateData: any = { failedAttempts };
      
      if (failedAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      
      await this.usersRepository.update(user.id, updateData);
      
      if (failedAttempts >= 5) {
        throw new UnauthorizedException('Account is locked. Try again in 15 minutes.');
      }
      
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts upon successful login
    if (user.failedAttempts > 0 || user.lockedUntil) {
      await this.usersRepository.update(user.id, {
        failedAttempts: 0,
        lockedUntil: null,
      });
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email address before logging in.');
    }

    if (user.isTwoFactorEnabled) {
      return successResponse(
        'Two-factor authentication code required',
        {
          isTwoFactorRequired: true,
          userId: user.id,
        },
        HttpStatus.OK,
      );
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    const hashedRefreshToken = await hashPassword(tokens.refreshToken);

    await this.usersRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    // Redis Session Storage
    const sessionKey = `session:${user.id}`;
    await this.cacheService.set(sessionKey, hashedRefreshToken, 604800); // 7 days TTL

    const { password, refreshToken, ...safeUser } = user;

    await this.cacheService.set(
      REDIS_KEYS.USER_PROFILE(user.id),
      safeUser,
      CACHE_TTL.USER_PROFILE,
    );

    return successResponse(
      'Login successful',
      {
        user: safeUser,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      HttpStatus.OK,
    );
  }

  async getProfile(userId: string) {
    const cacheKey = REDIS_KEYS.USER_PROFILE(userId);
    const cachedProfile = await this.cacheService.get(cacheKey);
    if (cachedProfile) {
      return successResponse(
        'User profile fetched successfully',
        cachedProfile,
        HttpStatus.OK,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        websiteUrl: true,
        githubUrl: true,
        techStack: true,
        role: true,
        isVerified: true,
        isTwoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
        blogs: {
          where: {
            status: 'PUBLISHED',
          },
          select: {
            views: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const totalViews = user.blogs.reduce((sum, b) => sum + (b.views || 0), 0);
    
    const followersCount = await this.prisma.follow.count({
      where: {
        followingId: user.id,
      },
    });

    const followingCount = await this.prisma.follow.count({
      where: {
        followerId: user.id,
      },
    });

    const { blogs, ...safeUser } = user;
    const responseData = {
      ...safeUser,
      totalViews,
      followersCount,
      followingCount,
    };

    await this.cacheService.set(cacheKey, responseData, CACHE_TTL.USER_PROFILE);

    return successResponse(
      'User profile fetched successfully',
      responseData,
      HttpStatus.OK,
    );
  }

  async getPublicProfileByUsername(username: string, currentUserId?: string) {
    const cacheKey = REDIS_KEYS.USER_PROFILE_BY_USERNAME(username);
    const cachedProfile = await this.cacheService.get(cacheKey);
    let profileData: any;

    if (cachedProfile) {
      profileData = cachedProfile;
    } else {
      const user = await this.prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          username: true,
          email: true,
          bio: true,
          avatar: true,
          websiteUrl: true,
          githubUrl: true,
          techStack: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          blogs: {
            where: {
              status: 'PUBLISHED',
            },
            select: {
              views: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const totalViews = user.blogs.reduce((sum, b) => sum + (b.views || 0), 0);
      
      const followersCount = await this.prisma.follow.count({
        where: {
          followingId: user.id,
        },
      });

      const followingCount = await this.prisma.follow.count({
        where: {
          followerId: user.id,
        },
      });

      const { blogs, ...safeUser } = user;
      profileData = {
        ...safeUser,
        totalViews,
        followersCount,
        followingCount,
      };

      await this.cacheService.set(cacheKey, profileData, CACHE_TTL.USER_PROFILE);
    }

    let isFollowing = false;
    if (currentUserId && profileData.id) {
      const followRecord = await this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: profileData.id,
          },
        },
      });
      isFollowing = !!followRecord;
    }

    const responseData = {
      ...profileData,
      isFollowing,
    };

    return successResponse(
      'Public user profile fetched successfully',
      responseData,
      HttpStatus.OK,
    );
  }

  async toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const targetUser = await this.usersRepository.findById(followingId);
    if (!targetUser) {
      throw new NotFoundException('User to follow not found');
    }

    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    let followed = false;
    if (existingFollow) {
      await this.prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });
    } else {
      await this.prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
      followed = true;
    }

    // Invalidate caches
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(followerId));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(followingId));
    await this.cacheService.deleteByPattern(REDIS_KEYS.ALL_FEEDS_BY_USER(followerId));
    await this.cacheService.deleteByPattern(REDIS_KEYS.ALL_FEEDS_BY_USER(followingId));
    if (targetUser.username) {
      await this.cacheService.del(REDIS_KEYS.USER_PROFILE_BY_USERNAME(targetUser.username));
    }
    const followerUser = await this.usersRepository.findById(followerId);
    if (followerUser?.username) {
      await this.cacheService.del(REDIS_KEYS.USER_PROFILE_BY_USERNAME(followerUser.username));
    }

    return successResponse(
      followed ? 'Followed user successfully' : 'Unfollowed user successfully',
      { followed },
      HttpStatus.OK,
    );
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const data: Prisma.UserUpdateInput = {};

    if (dto.firstname !== undefined) {
      const t = dto.firstname.trim();
      if (!t) {
        throw new BadRequestException('First name cannot be empty');
      }
      data.firstname = t;
    }

    if (dto.lastname !== undefined) {
      data.lastname = dto.lastname.trim() || null;
    }

    if (dto.bio !== undefined) {
      data.bio = dto.bio.trim() || null;
    }

    if (dto.websiteUrl !== undefined) {
      data.websiteUrl = dto.websiteUrl.trim() || null;
    }

    if (dto.githubUrl !== undefined) {
      data.githubUrl = dto.githubUrl.trim() || null;
    }

    if (dto.techStack !== undefined) {
      if (!Array.isArray(dto.techStack)) {
        throw new BadRequestException('Tech stack must be an array of strings');
      }
      const cleaned = Array.from(
        new Set(dto.techStack.map((t) => t.trim()).filter(Boolean)),
      );
      if (cleaned.length > 15) {
        throw new BadRequestException('Tech stack cannot have more than 15 items');
      }
      for (const tag of cleaned) {
        if (tag.length > 30) {
          throw new BadRequestException('Each tech tag must be less than 30 characters');
        }
      }
      data.techStack = cleaned;
    }

    if (Object.keys(data).length === 0) {
      const { password, refreshToken, ...safeUser } = user;
      return successResponse('Profile unchanged', safeUser, HttpStatus.OK);
    }

    const updatedUser = await this.usersRepository.update(userId, data);

    await this.cacheService.del(REDIS_KEYS.USER(userId));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(userId));
    if (user && user.username) {
      await this.cacheService.del(REDIS_KEYS.USER_PROFILE_BY_USERNAME(user.username));
    }

    const { password, refreshToken, ...safeUser } = updatedUser;

    return successResponse(
      'Profile updated successfully',
      safeUser,
      HttpStatus.OK,
    );
  }

  async getPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        preferences: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const defaultPrefs = {
      theme: 'dark',
      fontScale: 100,
      notify: {
        followers: { push: true, email: false },
        engagement: { push: true, email: true },
        newsletter: { push: false, email: true },
      },
      publicProfile: true,
    };

    return successResponse(
      'Preferences fetched successfully',
      user.preferences || defaultPrefs,
      HttpStatus.OK,
    );
  }

  async updatePreferences(userId: string, preferences: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentPrefs = (user.preferences as any) || {
      theme: 'dark',
      fontScale: 100,
      notify: {
        followers: { push: true, email: false },
        engagement: { push: true, email: true },
        newsletter: { push: false, email: true },
      },
      publicProfile: true,
    };

    const mergedPrefs = {
      ...currentPrefs,
      ...preferences,
      notify: preferences.notify ? {
        ...currentPrefs.notify,
        ...preferences.notify,
      } : currentPrefs.notify,
    };

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        preferences: mergedPrefs as any,
      },
    });

    await this.cacheService.del(REDIS_KEYS.USER(userId));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(userId));
    if (user.username) {
      await this.cacheService.del(REDIS_KEYS.USER_PROFILE_BY_USERNAME(user.username));
    }

    return successResponse(
      'Preferences updated successfully',
      updatedUser.preferences,
      HttpStatus.OK,
    );
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
      });

      const user = await this.usersRepository.findById(payload.id);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Validate the incoming refresh token against the stored bcrypt hash
      const isRefreshTokenMatched = await comparePassword(
        refreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenMatched) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify the Redis session is still alive (soft-check; not strict comparison)
      const sessionKey = `session:${payload.id}`;
      const cachedSession = await this.cacheService.get<string>(sessionKey);
      if (!cachedSession) {
        // Redis session expired — validate via DB token match only, then re-hydrate session
        this.logger?.warn?.(`Session cache miss for user ${payload.id}, re-hydrating from DB token match.`);
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      const hashedRefreshToken = await hashPassword(tokens.refreshToken);

      await this.usersRepository.update(user.id, {
        refreshToken: hashedRefreshToken,
      });

      // Renew the Redis session with fresh token hash and reset 7-day TTL
      await this.cacheService.set(sessionKey, hashedRefreshToken, 604800);

      return successResponse(
        'Token refreshed successfully',
        tokens,
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersRepository.update(userId, {
      refreshToken: null,
    });

    await this.cacheService.del(REDIS_KEYS.USER(userId));

    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(userId));

    // Delete Redis Session
    await this.cacheService.del(`session:${userId}`);

    return successResponse('Logout successful', null, HttpStatus.OK);
  }

  async uploadProfilePic(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let imageUrl: string;

    try {
      imageUrl = await this.s3Service.uploadFile(file, 'profile-pics');
    } catch (error) {
      throw new BadRequestException('Profile image upload failed');
    }

    const updatedUser = await this.usersRepository.update(userId, {
      avatar: imageUrl,
    });

    await this.cacheService.del(REDIS_KEYS.USER(userId));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(userId));
    if (user && user.username) {
      await this.cacheService.del(REDIS_KEYS.USER_PROFILE_BY_USERNAME(user.username));
    }

    const { password, refreshToken, ...safeUser } = updatedUser;

    return successResponse(
      'Profile picture uploaded successfully',
      safeUser,
      HttpStatus.OK,
    );
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = {
      id: userId,
      email,
      role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET')!,

      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN') as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,

      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN') as any,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const email = forgotPasswordDto.email.toLowerCase().trim();
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    // Generate a secure reset token
    const resetToken = this.jwtService.sign(
      { userId: user.id },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET')!,
        expiresIn: '15m',
      },
    );

    // Save token in Redis with user ID as value and 15 minutes TTL
    const resetTokenKey = `password-reset:${resetToken}`;
    await this.cacheService.set(resetTokenKey, user.id, 900); // 15 minutes TTL

    const resetLink = `${
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'
    }/reset-password?token=${resetToken}`;

    await this.emailService.sendForgotPasswordEmail(
      user.email,
      user.firstname,
      resetLink,
    );

    return successResponse('Password reset link sent successfully', null);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const resetTokenKey = `password-reset:${resetPasswordDto.token}`;
    const userId = await this.cacheService.get<string>(resetTokenKey);

    if (!userId) {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await hashPassword(resetPasswordDto.password);

    await this.usersRepository.update(user.id, {
      password: hashedPassword,
    });

    // Delete token from Redis
    await this.cacheService.del(resetTokenKey);

    await this.cacheService.del(REDIS_KEYS.USER(user.id));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(user.id));
    if (user.username) {
      await this.cacheService.del(
        REDIS_KEYS.USER_PROFILE_BY_USERNAME(user.username),
      );
    }

    return successResponse('Password reset successfully', null);
  }

  async verifyEmail(token: string) {
    const verifyTokenKey = `email-verification:${token}`;
    const userId = await this.cacheService.get<string>(verifyTokenKey);

    if (!userId) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.verifyUser(userId);

    // Send Welcome Email upon successful verification
    await this.emailService.sendWelcomeEmail(user.email, user.firstname);

    // Delete token from Redis
    await this.cacheService.del(verifyTokenKey);

    // Invalidate caches
    await this.cacheService.del(REDIS_KEYS.USER(userId));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(userId));
    if (user.username) {
      await this.cacheService.del(
        REDIS_KEYS.USER_PROFILE_BY_USERNAME(user.username),
      );
    }

    return successResponse('Email verified successfully', null);
  }

  async resendVerification(email: string) {
    const formattedEmail = email.toLowerCase().trim();
    const user = await this.usersRepository.findByEmail(formattedEmail);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new email verification token
    const verificationToken = uuidv4();
    const verifyTokenKey = `email-verification:${verificationToken}`;
    await this.cacheService.set(verifyTokenKey, user.id, 86400); // 24 hours TTL

    const verifyLink = `${
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'
    }/verify-email?token=${verificationToken}`;

    await this.emailService.sendVerifyEmail(user.email, user.firstname, verifyLink);

    return successResponse('Verification email sent successfully', null);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatched = await comparePassword(dto.oldPassword, user.password);
    if (!isPasswordMatched) {
      throw new BadRequestException('Incorrect old password');
    }

    const hashedPassword = await hashPassword(dto.newPassword);
    await this.usersRepository.update(userId, {
      password: hashedPassword,
    });

    // Invalidate caches
    await this.cacheService.del(REDIS_KEYS.USER(userId));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(userId));
    if (user.username) {
      await this.cacheService.del(REDIS_KEYS.USER_PROFILE_BY_USERNAME(user.username));
    }

    return successResponse('Password changed successfully', null);
  }

  async updateEmail(userId: string, dto: UpdateEmailDto) {
    const newEmail = dto.newEmail.toLowerCase().trim();

    const existingUser = await this.usersRepository.findByEmail(newEmail);
    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException('Email already in use');
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.usersRepository.update(userId, {
      email: newEmail,
    });

    // Invalidate caches
    await this.cacheService.del(REDIS_KEYS.USER(userId));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(userId));
    if (user.username) {
      await this.cacheService.del(REDIS_KEYS.USER_PROFILE_BY_USERNAME(user.username));
    }

    const { password, refreshToken, ...safeUser } = updatedUser;
    return successResponse('Email updated successfully', safeUser);
  }

  async deleteAccount(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prisma onDelete: Cascade will handle deleting follows, comments, blogs, bookmarks, notifications
    await this.prisma.user.delete({
      where: { id: userId },
    });

    // Clean up cache keys
    await this.cacheService.del(REDIS_KEYS.USER(userId));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(userId));
    if (user.username) {
      await this.cacheService.del(REDIS_KEYS.USER_PROFILE_BY_USERNAME(user.username));
    }
    await this.cacheService.deleteByPattern(REDIS_KEYS.ALL_FEEDS_BY_USER(userId));

    return successResponse('Account deleted successfully', null);
  }

  async exportData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        websiteUrl: true,
        githubUrl: true,
        role: true,
        createdAt: true,
        blogs: {
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            content: true,
            status: true,
            views: true,
            createdAt: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            blogId: true,
            createdAt: true,
          },
        },
        bookmarks: {
          select: {
            id: true,
            blogId: true,
            createdAt: true,
          },
        },
        likes: {
          select: {
            id: true,
            blogId: true,
            createdAt: true,
          },
        },
      },
    });

    return successResponse('Data exported successfully', user);
  }

  async generateTwoFactor(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const secret = generateSecret();
    const otpauthUrl = generateURI({
      label: user.email,
      issuer: 'Nova Blogs',
      secret,
    });

    // Save secret to Redis temporarily (10 minutes TTL) instead of database
    const tempSecretKey = `2fa-temp-secret:${userId}`;
    await this.cacheService.set(tempSecretKey, secret, 600);

    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

    // Evict user caches
    await this.cacheService.del(REDIS_KEYS.USER(userId));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(userId));

    return successResponse('2FA secret generated successfully', {
      secret,
      qrCodeDataUrl,
    });
  }

  async enableTwoFactor(userId: string, code: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tempSecretKey = `2fa-temp-secret:${userId}`;
    const secret = await this.cacheService.get<string>(tempSecretKey);
    if (!secret) {
      throw new BadRequestException('Two-factor authentication setup expired or not initiated');
    }

    const result = await verify({
      token: code,
      secret,
    });

    if (!result || !result.valid) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.usersRepository.update(userId, {
      isTwoFactorEnabled: true,
      twoFactorSecret: secret,
    });

    // Remove temp secret from Redis
    await this.cacheService.del(tempSecretKey);

    // Evict user caches
    await this.cacheService.del(REDIS_KEYS.USER(userId));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(userId));

    return successResponse('Two-factor authentication enabled successfully', {
      isTwoFactorEnabled: true,
    });
  }

  async disableTwoFactor(userId: string, code: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('Two-factor authentication is not enabled');
    }

    const result = await verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!result || !result.valid) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.usersRepository.update(userId, {
      isTwoFactorEnabled: false,
      twoFactorSecret: null,
    });

    // Evict user caches
    await this.cacheService.del(REDIS_KEYS.USER(userId));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(userId));

    return successResponse('Two-factor authentication disabled successfully', {
      isTwoFactorEnabled: false,
    });
  }

  async verifyTwoFactorLogin(userId: string, code: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.twoFactorSecret || !user.isTwoFactorEnabled) {
      throw new UnauthorizedException('Two-factor authentication is not enabled');
    }

    const result = await verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!result || !result.valid) {
      throw new UnauthorizedException('Invalid verification code');
    }

    // Standard tokens generation & logic
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    const hashedRefreshToken = await hashPassword(tokens.refreshToken);

    await this.usersRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    // Redis Session Storage
    const sessionKey = `session:${user.id}`;
    await this.cacheService.set(sessionKey, hashedRefreshToken, 604800); // 7 days TTL

    const { password, refreshToken, ...safeUser } = user;

    await this.cacheService.set(
      REDIS_KEYS.USER_PROFILE(user.id),
      safeUser,
      CACHE_TTL.USER_PROFILE,
    );

    return successResponse('Login successful', {
      user: safeUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
}
