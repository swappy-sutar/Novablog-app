import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import * as express from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from './guards/optional-jwt.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { ImageUpload } from 'src/common/decorator/image-upload.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  async resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto.email);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.login(loginDto);
    const data = result.data as any;
    if (data && data.refreshToken) {
      const { accessToken, refreshToken, user } = data;
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });
      return {
        ...result,
        data: {
          user,
          accessToken,
        },
      };
    }
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('profile/:username')
  async getPublicProfile(
    @Param('username') username: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.authService.getPublicProfileByUsername(username, currentUser?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('follow/:userId')
  async toggleFollow(
    @Param('userId') followingId: string,
    @CurrentUser() user: any,
  ) {
    return this.authService.toggleFollow(user.id, followingId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(user.id, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('preferences')
  async getPreferences(@CurrentUser() user: any) {
    return this.authService.getPreferences(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('preferences')
  async updatePreferences(
    @CurrentUser() user: any,
    @Body() preferences: any,
  ) {
    return this.authService.updatePreferences(user.id, preferences);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-profile')
  @ImageUpload('image')
  async uploadProfilePic(
    @UploadedFile()
    file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    return this.authService.uploadProfilePic(user.id, file);
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: express.Request,
    @Body('refreshToken') bodyRefreshToken: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const refreshToken = req.cookies?.refreshToken || bodyRefreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const result = await this.authService.refreshToken(refreshToken);
    const data = result.data as any;
    if (data && data.refreshToken) {
      const { accessToken, refreshToken: newRefreshToken } = data;
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });
      return {
        ...result,
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      };
    }
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: any,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.logout(user.id);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
    return result;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-email')
  async updateEmail(
    @CurrentUser() user: any,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    return this.authService.updateEmail(user.id, updateEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-account')
  async deleteAccount(@CurrentUser() user: any) {
    return this.authService.deleteAccount(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('export-data')
  async exportData(@CurrentUser() user: any) {
    return this.authService.exportData(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  async generate2FA(@CurrentUser() user: any) {
    return this.authService.generateTwoFactor(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/enable')
  async enable2FA(@CurrentUser() user: any, @Body('code') code: string) {
    return this.authService.enableTwoFactor(user.id, code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable')
  async disable2FA(@CurrentUser() user: any, @Body('code') code: string) {
    return this.authService.disableTwoFactor(user.id, code);
  }

  @Post('2fa/verify-login')
  async verify2FALogin(
    @Body('userId') userId: string,
    @Body('code') code: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.verifyTwoFactorLogin(userId, code);
    const data = result.data as any;
    if (data && data.refreshToken) {
      const { accessToken, refreshToken, user } = data;
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });
      return {
        ...result,
        data: {
          user,
          accessToken,
        },
      };
    }
    return result;
  }
}
