import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogsRepository } from './repository/blog.repository';

@Module({
  controllers: [BlogController],
  providers: [BlogService, BlogsRepository],
})
export class BlogModule {}
