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

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    const hashedRefreshToken = await hashPassword(tokens.refreshToken);

    await this.usersRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    const { password, refreshToken, ...safeUser } = user;

    await this.cacheService.del(REDIS_KEYS.USER(user.id));

    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(user.id));

    await this.emailService.sendWelcomeEmail(user.email, user.firstname);

    return successResponse(
      'User registered successfully',
      {
        user: safeUser,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
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

    const isPasswordMatched = await comparePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
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

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
      });

      const user = await this.usersRepository.findById(payload.id);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenMatched = await comparePassword(
        refreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenMatched) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      const hashedRefreshToken = await hashPassword(tokens.refreshToken);

      await this.usersRepository.update(user.id, {
        refreshToken: hashedRefreshToken,
      });

      return successResponse(
        'Token refreshed successfully',
        tokens,
        HttpStatus.OK,
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersRepository.update(userId, {
      refreshToken: null,
    });

    await this.cacheService.del(REDIS_KEYS.USER(userId));

    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(userId));

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
        expiresIn: '1h',
      },
    );
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.usersRepository.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpires,
    });

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
    const user = await this.usersRepository.findByResetToken(
      resetPasswordDto.token,
    );

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    if (!user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
      throw new BadRequestException('Token has expired');
    }

    const hashedPassword = await hashPassword(resetPasswordDto.password);

    await this.usersRepository.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    await this.cacheService.del(REDIS_KEYS.USER(user.id));
    await this.cacheService.del(REDIS_KEYS.USER_PROFILE(user.id));
    if (user.username) {
      await this.cacheService.del(
        REDIS_KEYS.USER_PROFILE_BY_USERNAME(user.username),
      );
    }

    return successResponse('Password reset successfully', null);
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

    // Save secret to database temporarily (it becomes active after verify/enable)
    await this.usersRepository.update(userId, {
      twoFactorSecret: secret,
    });

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
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('Two-factor authentication is not set up');
    }

    const result = await verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!result || !result.valid) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.usersRepository.update(userId, {
      isTwoFactorEnabled: true,
    });

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
