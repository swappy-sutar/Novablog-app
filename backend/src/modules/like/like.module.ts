import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikesService } from './like.service';
import { LikesRepository } from './repository/likes.repository';
import { BlogsRepository } from '../blog/repository/blog.repository';

@Module({
  controllers: [LikeController],
  providers: [LikesService, LikesRepository, BlogsRepository],
})
export class LikeModule {}
