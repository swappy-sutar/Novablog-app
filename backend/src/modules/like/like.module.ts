import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikesService } from './like.service';
import { LikesRepository } from './repository/likes.repository';
import { BlogsRepository } from '../blog/repository/blog.repository';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [LikeController],
  providers: [LikesService, LikesRepository, BlogsRepository],
})
export class LikeModule {}
