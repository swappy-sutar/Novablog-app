import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from './repositories/users.repository';
import { CacheService } from 'src/config/redis/cache.service';
import { S3Service } from 'src/config/s3/s3.service';
import { EmailService } from 'src/jobs/email/email.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as hashUtil from '../../common/utils/hash.util';

// Mock the hash utility module
jest.mock('../../common/utils/hash.util', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed-password'),
  comparePassword: jest.fn().mockResolvedValue(true),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid-token'),
}));

// Mock otplib
jest.mock('otplib', () => ({
  generateSecret: jest.fn().mockReturnValue('MOCK2FASECRET'),
  generateURI: jest.fn().mockReturnValue('otpauth://totp/test'),
  verify: jest.fn().mockReturnValue({ valid: true }),
}));

// Mock qrcode
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockqr'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let cacheService: jest.Mocked<CacheService>;
  let s3Service: jest.Mocked<S3Service>;
  let emailService: jest.Mocked<EmailService>;
  let prismaService: any;

  const mockUser = {
    id: 'user-1',
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'hashed-password',
    bio: null,
    avatar: null,
    websiteUrl: null,
    githubUrl: null,
    techStack: [],
    role: 'USER',
    isVerified: false,
    isActive: true,
    refreshToken: 'hashed-refresh-token',
    twoFactorSecret: null,
    isTwoFactorEnabled: false,
    failedAttempts: 0,
    lockedUntil: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
            update: jest.fn(),
            verifyUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
            verifyAsync: jest.fn(),
            sign: jest.fn().mockReturnValue('mock-reset-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config: Record<string, string> = {
                JWT_ACCESS_SECRET: 'access_secret',
                JWT_REFRESH_SECRET: 'refresh_secret',
                ACCESS_TOKEN_EXPIRES_IN: '15m',
                REFRESH_TOKEN_EXPIRES_IN: '7d',
                FRONTEND_URL: 'http://localhost:5173',
              };
              return config[key];
            }),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(undefined),
            del: jest.fn().mockResolvedValue(undefined),
            deleteByPattern: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: S3Service,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue('https://s3.example.com/image.jpg'),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendVerifyEmail: jest.fn().mockResolvedValue(undefined),
            sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
            sendForgotPasswordEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
            follow: {
              findUnique: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              count: jest.fn().mockResolvedValue(0),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    cacheService = module.get(CacheService);
    s3Service = module.get(S3Service);
    emailService = module.get(EmailService);
    prismaService = module.get(PrismaService);

    // Reset all mocks before each test
    jest.clearAllMocks();
    // Re-apply default mock implementations
    (hashUtil.hashPassword as jest.Mock).mockResolvedValue('hashed-password');
    (hashUtil.comparePassword as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('mock-jwt-token');
    jwtService.sign.mockReturnValue('mock-reset-token');
  });

  // ─── REGISTRATION ───────────────────────────────────────────────

  describe('register', () => {
    const registerDto = {
      firstname: 'John',
      lastname: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should register a new user and return tokens', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.data).toHaveProperty('accessToken');
      expect(result.data).toHaveProperty('refreshToken');
      expect(result.data).toHaveProperty('user');
      // Should not include sensitive fields
      expect(result.data.user).not.toHaveProperty('password');
      expect(result.data.user).not.toHaveProperty('refreshToken');
    });

    it('should hash the password before storing', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(mockUser);

      await service.register(registerDto);

      expect(hashUtil.hashPassword).toHaveBeenCalledWith('password123');
      expect(usersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashed-password' }),
      );
    });

    it('should reject duplicate email', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
      await expect(service.register(registerDto)).rejects.toThrow('Email already exists');
    });

    it('should reject duplicate username', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
      await expect(service.register(registerDto)).rejects.toThrow('Username already exists');
    });

    it('should store hashed refresh token in DB and Redis session', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(mockUser);

      await service.register(registerDto);

      // DB update with hashed refresh token
      expect(usersRepository.update).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({ refreshToken: 'hashed-password' }),
      );
      // Redis session storage with 7 day TTL
      expect(cacheService.set).toHaveBeenCalledWith(
        `session:${mockUser.id}`,
        'hashed-password',
        604800,
      );
    });

    it('should send verification and welcome emails', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(mockUser);

      await service.register(registerDto);

      expect(emailService.sendVerifyEmail).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.firstname,
        expect.stringContaining('verify-email?token='),
      );
      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.firstname,
      );
    });

    it('should create email verification token in Redis', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(mockUser);

      await service.register(registerDto);

      expect(cacheService.set).toHaveBeenCalledWith(
        'email-verification:mock-uuid-token',
        mockUser.id,
        86400,
      );
    });
  });

  // ─── LOGIN ──────────────────────────────────────────────────────

  describe('login', () => {
    const loginDto = { email: 'john@example.com', password: 'password123' };

    it('should login with valid credentials and return tokens', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Login successful');
      expect(result.data).toHaveProperty('accessToken');
      expect(result.data).toHaveProperty('refreshToken');
      expect(result.data.user).not.toHaveProperty('password');
    });

    it('should reject invalid email (user not found)', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should reject wrong password', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);
      (hashUtil.comparePassword as jest.Mock).mockResolvedValue(false);
      usersRepository.update.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should increment failed attempts on wrong password', async () => {
      usersRepository.findByEmail.mockResolvedValue({ ...mockUser, failedAttempts: 2 });
      (hashUtil.comparePassword as jest.Mock).mockResolvedValue(false);
      usersRepository.update.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);

      expect(usersRepository.update).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({ failedAttempts: 3 }),
      );
    });

    it('should lock account after 5 failed attempts', async () => {
      usersRepository.findByEmail.mockResolvedValue({ ...mockUser, failedAttempts: 4 });
      (hashUtil.comparePassword as jest.Mock).mockResolvedValue(false);
      usersRepository.update.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow('Account is locked. Try again in 15 minutes.');

      expect(usersRepository.update).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({
          failedAttempts: 5,
          lockedUntil: expect.any(Date),
        }),
      );
    });

    it('should reject login when account is locked', async () => {
      const futureDate = new Date(Date.now() + 15 * 60 * 1000);
      usersRepository.findByEmail.mockResolvedValue({
        ...mockUser,
        lockedUntil: futureDate,
      });

      await expect(service.login(loginDto)).rejects.toThrow('Account is locked. Try again in 15 minutes.');
    });

    it('should reset failed attempts on successful login', async () => {
      usersRepository.findByEmail.mockResolvedValue({
        ...mockUser,
        failedAttempts: 3,
        lockedUntil: new Date(Date.now() - 1000), // expired lock
      });
      usersRepository.update.mockResolvedValue(mockUser);

      await service.login(loginDto);

      // First call resets failed attempts, second stores refresh token
      expect(usersRepository.update).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({ failedAttempts: 0, lockedUntil: null }),
      );
    });

    it('should return 2FA prompt if 2FA is enabled', async () => {
      usersRepository.findByEmail.mockResolvedValue({
        ...mockUser,
        isTwoFactorEnabled: true,
        twoFactorSecret: 'secret',
      });

      const result = await service.login(loginDto);

      expect(result.data).toHaveProperty('isTwoFactorRequired', true);
      expect(result.data).toHaveProperty('userId', mockUser.id);
      expect(result.data).not.toHaveProperty('accessToken');
    });

    it('should store session in Redis on successful login', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(mockUser);

      await service.login(loginDto);

      expect(cacheService.set).toHaveBeenCalledWith(
        `session:${mockUser.id}`,
        'hashed-password',
        604800,
      );
    });
  });

  // ─── TOKEN REFRESH ──────────────────────────────────────────────

  describe('refreshToken', () => {
    it('should issue new tokens with valid refresh token', async () => {
      jwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      cacheService.get.mockResolvedValue('hashed-refresh-token');
      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(mockUser);

      const result = await service.refreshToken('valid-refresh-token');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Token refreshed successfully');
      expect(result.data).toHaveProperty('accessToken');
      expect(result.data).toHaveProperty('refreshToken');
    });

    it('should reject when Redis session is expired/missing', async () => {
      jwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      cacheService.get.mockResolvedValue(null);

      await expect(service.refreshToken('some-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should reject when refresh token does not match DB', async () => {
      jwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      cacheService.get.mockResolvedValue('hashed-refresh-token');
      usersRepository.findById.mockResolvedValue(mockUser);
      (hashUtil.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(service.refreshToken('wrong-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should reject with invalid/expired JWT refresh token', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));

      await expect(service.refreshToken('expired-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── LOGOUT ─────────────────────────────────────────────────────

  describe('logout', () => {
    it('should clear refresh token from DB', async () => {
      usersRepository.update.mockResolvedValue(mockUser);

      await service.logout(mockUser.id);

      expect(usersRepository.update).toHaveBeenCalledWith(mockUser.id, {
        refreshToken: null,
      });
    });

    it('should delete Redis session and caches', async () => {
      usersRepository.update.mockResolvedValue(mockUser);

      await service.logout(mockUser.id);

      expect(cacheService.del).toHaveBeenCalledWith(`session:${mockUser.id}`);
    });
  });

  // ─── GET PROFILE ────────────────────────────────────────────────

  describe('getProfile', () => {
    it('should return cached profile when available', async () => {
      const cachedProfile = { id: mockUser.id, firstname: 'John' };
      cacheService.get.mockResolvedValue(cachedProfile);

      const result = await service.getProfile(mockUser.id);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(cachedProfile);
      expect(prismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should fetch from DB and cache when not cached', async () => {
      cacheService.get.mockResolvedValue(null);
      prismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        blogs: [{ views: 10 }, { views: 20 }],
      });
      prismaService.follow.count.mockResolvedValue(5);

      const result = await service.getProfile(mockUser.id);

      expect(result.success).toBe(true);
      expect(prismaService.user.findUnique).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existent user', async () => {
      cacheService.get.mockResolvedValue(null);
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── PASSWORD MANAGEMENT ───────────────────────────────────────

  describe('changePassword', () => {
    it('should change password with correct old password', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(mockUser);

      const result = await service.changePassword(mockUser.id, {
        oldPassword: 'oldpass',
        newPassword: 'newpass123',
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Password changed successfully');
      expect(hashUtil.hashPassword).toHaveBeenCalledWith('newpass123');
    });

    it('should reject with incorrect old password', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);
      (hashUtil.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword(mockUser.id, {
          oldPassword: 'wrongpass',
          newPassword: 'newpass123',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('forgotPassword', () => {
    it('should create Redis token and send email', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.forgotPassword({ email: 'john@example.com' });

      expect(result.success).toBe(true);
      expect(cacheService.set).toHaveBeenCalledWith(
        expect.stringContaining('password-reset:'),
        mockUser.id,
        3600,
      );
      expect(emailService.sendForgotPasswordEmail).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.firstname,
        expect.stringContaining('reset-password?token='),
      );
    });

    it('should throw NotFoundException for non-existent email', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.forgotPassword({ email: 'unknown@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      cacheService.get.mockResolvedValue(mockUser.id);
      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(mockUser);

      const result = await service.resetPassword({
        token: 'valid-reset-token',
        password: 'newpassword123',
      });

      expect(result.success).toBe(true);
      expect(hashUtil.hashPassword).toHaveBeenCalledWith('newpassword123');
      expect(cacheService.del).toHaveBeenCalledWith('password-reset:valid-reset-token');
    });

    it('should reject with invalid/expired token', async () => {
      cacheService.get.mockResolvedValue(null);

      await expect(
        service.resetPassword({
          token: 'expired-token',
          password: 'newpassword123',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── EMAIL VERIFICATION ────────────────────────────────────────

  describe('verifyEmail', () => {
    it('should verify email with valid token', async () => {
      cacheService.get.mockResolvedValue(mockUser.id);
      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.verifyUser.mockResolvedValue({ ...mockUser, isVerified: true });

      const result = await service.verifyEmail('valid-verify-token');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Email verified successfully');
      expect(usersRepository.verifyUser).toHaveBeenCalledWith(mockUser.id);
      expect(cacheService.del).toHaveBeenCalledWith('email-verification:valid-verify-token');
    });

    it('should reject invalid/expired verification token', async () => {
      cacheService.get.mockResolvedValue(null);

      await expect(service.verifyEmail('expired-token')).rejects.toThrow(BadRequestException);
    });
  });

  // ─── TWO-FACTOR AUTHENTICATION ─────────────────────────────────

  describe('generateTwoFactor', () => {
    it('should generate 2FA secret and QR code', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);

      const result = await service.generateTwoFactor(mockUser.id);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('secret');
      expect(result.data).toHaveProperty('qrCodeDataUrl');
      expect(cacheService.set).toHaveBeenCalledWith(
        `2fa-temp-secret:${mockUser.id}`,
        expect.any(String),
        600,
      );
    });

    it('should throw NotFoundException for non-existent user', async () => {
      usersRepository.findById.mockResolvedValue(null);

      await expect(service.generateTwoFactor('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('enableTwoFactor', () => {
    it('should enable 2FA with valid TOTP code', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);
      cacheService.get.mockResolvedValue('MOCK2FASECRET');
      usersRepository.update.mockResolvedValue({
        ...mockUser,
        isTwoFactorEnabled: true,
      });

      const result = await service.enableTwoFactor(mockUser.id, '123456');

      expect(result.success).toBe(true);
      expect(usersRepository.update).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({
          isTwoFactorEnabled: true,
          twoFactorSecret: 'MOCK2FASECRET',
        }),
      );
    });

    it('should reject when 2FA setup has expired', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);
      cacheService.get.mockResolvedValue(null);

      await expect(service.enableTwoFactor(mockUser.id, '123456')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject invalid TOTP code', async () => {
      const { verify } = require('otplib');
      verify.mockReturnValue({ valid: false });

      usersRepository.findById.mockResolvedValue(mockUser);
      cacheService.get.mockResolvedValue('MOCK2FASECRET');

      await expect(service.enableTwoFactor(mockUser.id, 'wrong')).rejects.toThrow(
        BadRequestException,
      );

      // Reset
      verify.mockReturnValue({ valid: true });
    });
  });

  describe('disableTwoFactor', () => {
    it('should disable 2FA with valid TOTP code', async () => {
      usersRepository.findById.mockResolvedValue({
        ...mockUser,
        isTwoFactorEnabled: true,
        twoFactorSecret: 'SECRET',
      });
      usersRepository.update.mockResolvedValue({
        ...mockUser,
        isTwoFactorEnabled: false,
      });

      const result = await service.disableTwoFactor(mockUser.id, '123456');

      expect(result.success).toBe(true);
      expect(usersRepository.update).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({
          isTwoFactorEnabled: false,
          twoFactorSecret: null,
        }),
      );
    });

    it('should throw when 2FA is not enabled', async () => {
      usersRepository.findById.mockResolvedValue(mockUser); // twoFactorSecret is null

      await expect(service.disableTwoFactor(mockUser.id, '123456')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyTwoFactorLogin', () => {
    it('should verify 2FA login and issue tokens', async () => {
      const user2FA = {
        ...mockUser,
        isTwoFactorEnabled: true,
        twoFactorSecret: 'SECRET',
      };
      usersRepository.findById.mockResolvedValue(user2FA);
      usersRepository.update.mockResolvedValue(user2FA);

      const result = await service.verifyTwoFactorLogin(mockUser.id, '123456');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Login successful');
      expect(result.data).toHaveProperty('accessToken');
      expect(result.data).toHaveProperty('refreshToken');
      expect(result.data).toHaveProperty('user');
    });

    it('should reject when 2FA is not enabled', async () => {
      usersRepository.findById.mockResolvedValue(mockUser); // 2FA not enabled

      await expect(
        service.verifyTwoFactorLogin(mockUser.id, '123456'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── DELETE ACCOUNT ─────────────────────────────────────────────

  describe('deleteAccount', () => {
    it('should delete user and clean up caches', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);
      prismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.deleteAccount(mockUser.id);

      expect(result.success).toBe(true);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(cacheService.del).toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existent user', async () => {
      usersRepository.findById.mockResolvedValue(null);

      await expect(service.deleteAccount('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── UPLOAD PROFILE PIC ────────────────────────────────────────

  describe('uploadProfilePic', () => {
    it('should upload and update avatar', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue({
        ...mockUser,
        avatar: 'https://s3.example.com/image.jpg',
      });

      const mockFile = { buffer: Buffer.from('test') } as Express.Multer.File;
      const result = await service.uploadProfilePic(mockUser.id, mockFile);

      expect(result.success).toBe(true);
      expect(s3Service.uploadFile).toHaveBeenCalledWith(mockFile, 'profile-pics');
    });

    it('should throw BadRequestException when no file provided', async () => {
      await expect(
        service.uploadProfilePic(mockUser.id, null as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
