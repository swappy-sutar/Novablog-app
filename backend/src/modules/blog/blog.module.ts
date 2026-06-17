import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogsRepository } from './repository/blog.repository';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [BlogController],
  providers: [BlogService, BlogsRepository],
})
export class BlogModule {}
