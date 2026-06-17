import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
