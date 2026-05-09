import { Injectable, NotFoundException } from '@nestjs/common';
import { BookmarksRepository } from './repository/bookmarks.repository';
import { CacheService } from 'src/config/redis/cache.service';
import { successResponse } from 'src/common/helpers/response.helper';
import { REDIS_KEYS } from 'src/config/redis/redis.keys';
import { CACHE_TTL } from 'src/config/redis/redis.ttl';
import { QueryBookmarkDto } from './dto/query-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly bookmarksRepository: BookmarksRepository,
    private readonly cacheService: CacheService,
  ) {}

  async toggleBookmark(blogId: string, userId: string) {
    const existingBookmark = await this.bookmarksRepository.findBookmark(
      blogId,
      userId,
    );

    if (existingBookmark) {
      await this.bookmarksRepository.delete(existingBookmark.id);

      await this.cacheService.deleteByPattern(`user-bookmarks:${userId}:*`);

      return successResponse('Bookmark removed successfully', {
        bookmarked: false,
      });
    }

    try {
      await this.bookmarksRepository.create(blogId, userId);
    } catch (error) {
      throw new NotFoundException('Blog not found');
    }

    await this.cacheService.deleteByPattern(`user-bookmarks:${userId}:*`);

    return successResponse('Blog bookmarked successfully', {
      bookmarked: true,
    });
  }

  async getUserBookmarks(userId: string, queryDto: QueryBookmarkDto) {
    const page = Number(queryDto.page) || 1;
    const limit = Number(queryDto.limit) || 10;

    const cacheKey = REDIS_KEYS.USER_BOOKMARKS(userId, page, limit);

    const cachedBookmarks = await this.cacheService.get(cacheKey);

    if (cachedBookmarks) {
      return successResponse('Bookmarks fetched successfully', cachedBookmarks);
    }

    const [bookmarks, total] = await Promise.all([
      this.bookmarksRepository.findUserBookmarks(userId, page, limit),

      this.bookmarksRepository.countUserBookmarks(userId),
    ]);

    const response = {
      bookmarks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.cacheService.set(cacheKey, response, CACHE_TTL.BLOGS);

    return successResponse('Bookmarks fetched successfully', response);
  }
}
