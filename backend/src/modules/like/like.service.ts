import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LikesRepository } from './repository/likes.repository';
import { BlogsRepository } from '../blog/repository/blog.repository';
import { successResponse } from 'src/common/helpers/response.helper';
import { CacheService } from 'src/config/redis/cache.service';
import { REDIS_KEYS } from 'src/config/redis/redis.keys';
import { CACHE_TTL } from 'src/config/redis/redis.ttl';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class LikesService {
  private readonly logger = new Logger(LikesService.name);

  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly cacheService: CacheService,
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async toggleLike(blogId: string, userId: string) {
    const existingLike = await this.likesRepository.findLike(blogId, userId);

    if (existingLike) {
      try {
        await this.likesRepository.delete(existingLike.id);
        await this.cacheService.del(REDIS_KEYS.BLOG_LIKES_COUNT(blogId));
        return successResponse('Blog unliked successfully', {
          liked: false,
        });
      } catch (error) {
        throw new NotFoundException('Blog not found');
      }
    }

    try {
      await this.likesRepository.create(blogId, userId);
      await this.cacheService.del(REDIS_KEYS.BLOG_LIKES_COUNT(blogId));

      // Asynchronously trigger notification in the background to avoid blocking response
      this.createLikeNotification(blogId, userId).catch((err) => {
        this.logger.error(`Failed to dispatch like notification: ${err.message}`);
      });

      return successResponse('Blog liked successfully', {
        liked: true,
      });
    } catch (error) {
      throw new NotFoundException('Blog not found');
    }
  }

  private async createLikeNotification(blogId: string, userId: string) {
    try {
      // 1. Get blog info (try cache first, fallback to minimal DB query)
      const blogCacheKey = REDIS_KEYS.BLOG(blogId);
      let blog = await this.cacheService.get<any>(blogCacheKey);

      if (!blog) {
        blog = await this.prisma.blog.findUnique({
          where: { id: blogId },
          select: { authorId: true, title: true },
        });
      }

      if (!blog || blog.authorId === userId) {
        return;
      }

      // 2. Get liker name (try cache first, fallback to minimal DB query)
      const userCacheKey = REDIS_KEYS.USER_PROFILE(userId);
      let liker = await this.cacheService.get<any>(userCacheKey);

      if (!liker) {
        liker = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { firstname: true, lastname: true, username: true },
        });
      }

      const likerName = liker
        ? `${liker.firstname || ''} ${liker.lastname || ''}`.trim() ||
          liker.username
        : 'Someone';

      // 3. Create real-time notification
      await this.notificationsService.createNotification(
        blog.authorId,
        NotificationType.LIKE,
        'New Like',
        `${likerName} liked your post: "${blog.title}"`,
      );
    } catch (error) {
      this.logger.error(`Error in createLikeNotification: ${error.message}`);
    }
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

  async checkLikeStatus(blogId: string, userId: string) {
    const existingLike = await this.likesRepository.findLike(blogId, userId);
    return successResponse('Like status checked successfully', {
      liked: !!existingLike,
    });
  }
}
