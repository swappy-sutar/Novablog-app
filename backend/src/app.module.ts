import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './config/prisma/prisma.module';
import { RedisModule } from './config/redis/redis.module';
import { BlogModule } from './modules/blog/blog.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LikeModule } from './modules/like/like.module';
import { BookmarkModule } from './modules/bookmark/bookmark.module';
import { JobsEmailModule } from './jobs/email/email.module';
import { BullMQModule } from './config/bullmq/bull.module';
import { ResendModule } from './config/resend/resend.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { APP_GUARD } from '@nestjs/core';
import Redis from 'ioredis';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: 60000,
            limit: 100,
          },
        ],
        storage: (() => {
          const redisUrl = config.get<string>('REDIS_URL');
          const redisClient = redisUrl
            ? new Redis(redisUrl, {
                tls: redisUrl.startsWith('rediss://')
                  ? { rejectUnauthorized: false }
                  : undefined,
              })
            : new Redis({
                host: config.get<string>('REDIS_HOST') || 'localhost',
                port: Number(config.get<string>('REDIS_PORT')) || 6379,
                password: config.get<string>('REDIS_PASSWORD') || undefined,
              });
          return new ThrottlerStorageRedisService(redisClient);
        })(),
      }),
    }),
    AuthModule,
    PrismaModule,
    RedisModule,
    BlogModule,
    CommentsModule,
    LikeModule,
    BookmarkModule,
    JobsEmailModule,
    BullMQModule,
    ResendModule,
    NotificationsModule,
    AdminModule,
    NewsletterModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
