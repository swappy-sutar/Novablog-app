import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './repository/comments.repository';
import { BlogsRepository } from '../blog/repository/blog.repository';

@Module({
  providers: [CommentsService, CommentsRepository, BlogsRepository],
  controllers: [CommentsController],
})
export class CommentsModule {}
