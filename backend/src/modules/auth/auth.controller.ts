import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
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

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: any) {
    return this.authService.logout(user.id);
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
  ) {
    return this.authService.verifyTwoFactorLogin(userId, code);
  }
}
