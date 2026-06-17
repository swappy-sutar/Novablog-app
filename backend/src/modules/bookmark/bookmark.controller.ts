import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { BookmarkService } from './bookmark.service';
import { QueryBookmarkDto } from './dto/query-bookmark.dto';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarksService: BookmarkService) {}

  @UseGuards(JwtAuthGuard)
  @Post('toggle/:blogId')
  async toggleBookmark(
    @Param('blogId') blogId: string,
    @CurrentUser() user: any,
  ) {
    return this.bookmarksService.toggleBookmark(blogId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-bookmarks')
  async getMyBookmarks(
    @CurrentUser() user: any,
    @Query() query: QueryBookmarkDto,
  ) {
    return this.bookmarksService.getUserBookmarks(user.id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/:blogId')
  async checkBookmarkStatus(
    @Param('blogId') blogId: string,
    @CurrentUser() user: any,
  ) {
    return this.bookmarksService.checkBookmarkStatus(blogId, user.id);
  }
}
