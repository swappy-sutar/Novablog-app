import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

// Mock the service module to prevent Jest from resolving otplib ESM imports
jest.mock('./auth.service', () => {
  return { AuthService: jest.fn() };
});

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockRes = () => {
    const res: any = {};
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockReq = (cookies: Record<string, string> = {}) => ({
    cookies,
  });

  const mockUser = { id: 'user-1', email: 'test@test.com', role: 'USER' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            getProfile: jest.fn(),
            getPublicProfileByUsername: jest.fn(),
            toggleFollow: jest.fn(),
            updateProfile: jest.fn(),
            uploadProfilePic: jest.fn(),
            refreshToken: jest.fn(),
            logout: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
            changePassword: jest.fn(),
            updateEmail: jest.fn(),
            deleteAccount: jest.fn(),
            exportData: jest.fn(),
            generateTwoFactor: jest.fn(),
            enableTwoFactor: jest.fn(),
            disableTwoFactor: jest.fn(),
            verifyTwoFactorLogin: jest.fn(),
            verifyEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  // ─── REGISTER ──────────────────────────────────────────────────

  describe('register', () => {
    it('should call authService.register and return the result', async () => {
      const mockResult = {
        success: true,
        statusCode: 201,
        message: 'Registration successful. Please verify your email.',
        data: {
          user: { id: 'user-1', firstname: 'John' },
        },
      };
      authService.register.mockResolvedValue(mockResult);

      const result = await controller.register({
        firstname: 'John',
        username: 'john',
        email: 'j@test.com',
        password: 'pass123',
      });

      expect(authService.register).toHaveBeenCalledWith({
        firstname: 'John',
        username: 'john',
        email: 'j@test.com',
        password: 'pass123',
      });
      expect(result).toEqual(mockResult);
    });
  });

  // ─── LOGIN ─────────────────────────────────────────────────────

  describe('login', () => {
    it('should set refresh token cookie on successful login', async () => {
      const res = mockRes();
      authService.login.mockResolvedValue({
        success: true,
        statusCode: 200,
        message: 'Login successful',
        data: {
          user: { id: 'user-1' },
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      });

      const result = await controller.login(
        { email: 'j@test.com', password: 'pass123' },
        res,
      );

      expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.any(Object));
      expect(result.data).not.toHaveProperty('refreshToken');
    });

    it('should not set cookie when 2FA is required (no refreshToken in data)', async () => {
      const res = mockRes();
      authService.login.mockResolvedValue({
        success: true,
        statusCode: 200,
        message: '2FA required',
        data: { isTwoFactorRequired: true, userId: 'user-1' },
      });

      const result = await controller.login(
        { email: 'j@test.com', password: 'pass123' },
        res,
      );

      expect(res.cookie).not.toHaveBeenCalled();
      expect(result.data).toHaveProperty('isTwoFactorRequired', true);
    });
  });

  // ─── REFRESH TOKEN ─────────────────────────────────────────────

  describe('refreshToken', () => {
    it('should read cookie, call service, and set new cookie', async () => {
      const req = mockReq({ refreshToken: 'old-refresh-token' });
      const res = mockRes();
      authService.refreshToken.mockResolvedValue({
        success: true,
        statusCode: 200,
        message: 'Refreshed',
        data: {
          accessToken: 'new-access',
          refreshToken: 'new-refresh',
        },
      });

      const result = await controller.refreshToken(req as any, res);

      expect(authService.refreshToken).toHaveBeenCalledWith('old-refresh-token');
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'new-refresh', expect.any(Object));
      expect(result.data).toHaveProperty('accessToken');
    });

    it('should throw UnauthorizedException when no cookie present', async () => {
      const req = mockReq({});
      const res = mockRes();

      await expect(controller.refreshToken(req as any, res)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ─── LOGOUT ────────────────────────────────────────────────────

  describe('logout', () => {
    it('should clear the refreshToken cookie', async () => {
      const res = mockRes();
      authService.logout.mockResolvedValue({
        success: true,
        statusCode: 200,
        message: 'Logout successful',
        data: null,
      });

      await controller.logout(mockUser, res);

      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });
      expect(authService.logout).toHaveBeenCalledWith(mockUser.id);
    });
  });

  // ─── PROFILE ───────────────────────────────────────────────────

  describe('getProfile', () => {
    it('should call service with user.id from JWT', async () => {
      authService.getProfile.mockResolvedValue({
        success: true,
        statusCode: 200,
        message: 'Profile',
        data: { id: 'user-1' },
      });

      const result = await controller.getProfile(mockUser);

      expect(authService.getProfile).toHaveBeenCalledWith('user-1');
      expect(result.data).toHaveProperty('id', 'user-1');
    });
  });

  describe('updateProfile', () => {
    it('should call service with user.id and DTO', async () => {
      const dto = { firstname: 'Updated' };
      authService.updateProfile.mockResolvedValue({
        success: true,
        statusCode: 200,
        message: 'Updated',
        data: { id: 'user-1', firstname: 'Updated' },
      });

      const result = await controller.updateProfile(mockUser, dto);

      expect(authService.updateProfile).toHaveBeenCalledWith('user-1', dto);
      expect(result.data).toHaveProperty('firstname', 'Updated');
    });
  });

  // ─── 2FA VERIFY LOGIN ─────────────────────────────────────────

  describe('verify2FALogin', () => {
    it('should set cookie on successful 2FA verification', async () => {
      const res = mockRes();
      authService.verifyTwoFactorLogin.mockResolvedValue({
        success: true,
        statusCode: 200,
        message: 'Login successful',
        data: {
          user: { id: 'user-1' },
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      });

      const result = await controller.verify2FALogin('user-1', '123456', res);

      expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.any(Object));
      expect(result.data).not.toHaveProperty('refreshToken');
      expect(result.data).toHaveProperty('accessToken');
    });
  });
});
