import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './repositories/users.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { comparePassword, hashPassword } from '../../common/utils/hash.util';
import { successResponse } from 'src/common/helpers/response.helper';
import { CacheService } from 'src/config/redis.config/cache.service';
import { REDIS_KEYS } from 'src/config/redis.config/redis.keys';
import { S3Service } from 'src/config/s3.config/s3.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly s3Service: S3Service,
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

    return successResponse(
      'User registered successfully',
      {
        user: safeUser,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      201,
    );
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByEmail(loginDto.email);

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

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    const hashedRefreshToken = await hashPassword(tokens.refreshToken);

    await this.usersRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    const { password, refreshToken, ...safeUser } = user;

    await this.cacheService.set(REDIS_KEYS.USER(user.id), safeUser, 300);

    return successResponse(
      'Login successful',
      {
        user: safeUser,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      200,
    );
  }

  async getProfile(userId: string) {
    const cacheKey = REDIS_KEYS.USER(userId);

    const cachedUser = await this.cacheService.get(cacheKey);

    if (cachedUser) {
      console.log('⚡ User profile from Redis cache');

      return successResponse(
        'User profile fetched successfully',
        cachedUser,
        200,
      );
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, refreshToken, ...safeUser } = user;

    await this.cacheService.set(cacheKey, safeUser, 300);

    return successResponse('User profile fetched successfully', safeUser, 200);
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

      return successResponse('Token refreshed successfully', tokens, 200);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersRepository.update(userId, {
      refreshToken: null,
    });

    await this.cacheService.del(REDIS_KEYS.USER(userId));

    return successResponse('Logout successful', null, 200);
  }

  async uploadProfilePic(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const imageUrl = await this.s3Service.uploadFile(file, 'profile-pics');

    const updatedUser = await this.usersRepository.update(userId, {
      avatar: imageUrl,
    });

    await this.cacheService.del(REDIS_KEYS.USER(userId));

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

      expiresIn: Number(this.configService.get('ACCESS_TOKEN_EXPIRES_IN')),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,

      expiresIn: Number(this.configService.get('REFRESH_TOKEN_EXPIRES_IN')),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
