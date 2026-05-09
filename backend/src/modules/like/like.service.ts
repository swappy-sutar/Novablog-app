import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesRepository } from './repository/likes.repository';
import { BlogsRepository } from '../blog/repository/blog.repository';
import { successResponse } from 'src/common/helpers/response.helper';
import { CacheService } from 'src/config/redis/cache.service';
import { REDIS_KEYS } from 'src/config/redis/redis.keys';
import { CACHE_TTL } from 'src/config/redis/redis.ttl';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly cacheService: CacheService,
  ) {}

  async toggleLike(blogId: string, userId: string) {
    const existingLike = await this.likesRepository.findLike(blogId, userId);

    if (existingLike) {
      await this.likesRepository.delete(existingLike.id);

      await this.cacheService.del(REDIS_KEYS.BLOG_LIKES_COUNT(blogId));

      return successResponse('Blog unliked successfully', {
        liked: false,
      });
    }

    try {
      await this.likesRepository.create(blogId, userId);
    } catch (error) {
      throw new NotFoundException('Blog not found');
    }

    await this.cacheService.del(REDIS_KEYS.BLOG_LIKES_COUNT(blogId));

    return successResponse('Blog liked successfully', {
      liked: true,
    });
  }

  async getLikesCount(blogId: string) {
    const cacheKey = REDIS_KEYS.BLOG_LIKES_COUNT(blogId);

    const cachedCount = await this.cacheService.get(cacheKey);

    if (cachedCount) {
      return successResponse('Likes count fetched successfully', cachedCount);
    }

    const count = await this.likesRepository.count(blogId);

    const response = {
      count,
    };

    await this.cacheService.set(cacheKey, response, CACHE_TTL.BLOG);

    return successResponse('Likes count fetched successfully', response);
  }
}
