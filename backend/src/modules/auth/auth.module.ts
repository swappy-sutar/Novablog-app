import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersRepository } from './repositories/users.repository';
import { S3Module } from 'src/config/s3/s3.module';
import { JobsEmailModule } from 'src/jobs/email/email.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET')!,
        signOptions: {
          expiresIn: configService.get('ACCESS_TOKEN_EXPIRES_IN') as any,
        },
      }),
    }),
    S3Module,
    JobsEmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersRepository],
  exports: [AuthService],
})
export class AuthModule {}
