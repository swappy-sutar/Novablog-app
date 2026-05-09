import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { BookmarksRepository } from './repository/bookmarks.repository';
import { BlogsRepository } from '../blog/repository/blog.repository';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService, BookmarksRepository, BlogsRepository],
})
export class BookmarkModule {}
