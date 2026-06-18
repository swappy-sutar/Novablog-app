import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { BlogsRepository } from './repository/blog.repository';
import { CacheService } from 'src/config/redis/cache.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { successResponse } from 'src/common/helpers/response.helper';
import { generateSlug } from 'src/common/utils/slug.util';
import { REDIS_KEYS } from 'src/config/redis/redis.keys';
import { CACHE_TTL } from 'src/config/redis/redis.ttl';
import { S3Service } from 'src/config/s3/s3.service';
import { QueryBlogDto } from './dto/query-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryFeedDto } from './dto/query-feed.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly cacheService: CacheService,
    private readonly s3Service: S3Service,
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createBlog(
    userId: string,
    createBlogDto: CreateBlogDto,
    file?: Express.Multer.File,
  ) {
    const slug = generateSlug(createBlogDto.title);

    const existingBlog = await this.blogsRepository.findBySlug(slug);

    let finalSlug = slug;

    if (existingBlog) {
      finalSlug = `${slug}-${nanoid(5)}`;
    }

    let thumbnail: string | undefined;

    if (file) {
      try {
        thumbnail = await this.s3Service.uploadFile(file, 'blog-thumbnails');
      } catch (error) {
        throw new BadRequestException('Thumbnail upload failed');
      }
    }

    const blog = await this.blogsRepository.create({
      title: createBlogDto.title,
      slug: finalSlug,
      content: createBlogDto.content,
      excerpt: createBlogDto.excerpt,
      thumbnail,
      status: createBlogDto.status || 'DRAFT',
      isFeatured: createBlogDto.isFeatured || false,
      readTime: Math.ceil(createBlogDto.content.split(' ').length / 200),
      publishedAt: createBlogDto.status === 'PUBLISHED' ? new Date() : null,
      author: {
        connect: {
          id: userId,
        },
      },
      ...(createBlogDto.categoryId && {
        category: {
          connect: {
            id: createBlogDto.categoryId,
          },
        },
      }),
    });

    await this.cacheService.deleteByPattern(REDIS_KEYS.ALL_BLOGS);

    await this.cacheService.del(REDIS_KEYS.FEATURED_BLOGS());

    await this.cacheService.del(REDIS_KEYS.RECENT_BLOGS());

    if (blog.status === 'PUBLISHED') {
      const authorName =
        `${blog.author?.firstname || ''} ${blog.author?.lastname || ''}`.trim() ||
        blog.author?.username ||
        'Someone';
      await this.notifyFollowers(userId, authorName, blog);
    }

    return successResponse('Blog created successfully', blog, 201);
  }

  async getAllBlogs(query: QueryBlogDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search;

    const cacheKey = REDIS_KEYS.BLOGS(page, limit, search);

    const cachedBlogs = await this.cacheService.get(cacheKey);

    if (cachedBlogs) {
      return successResponse('Blogs fetched successfully', cachedBlogs);
    }

    const [blogs, total] = await Promise.all([
      this.blogsRepository.findMany(page, limit, search),

      this.blogsRepository.count(search),
    ]);

    const response = {
      meta: {
        total,
        page,
        limit,

        totalPages: Math.ceil(total / limit),
      },

      blogs,
    };

    await this.cacheService.set(cacheKey, response, CACHE_TTL.BLOGS);

    return successResponse('Blogs fetched successfully', response);
  }

  async getMyBlogs(userId: string, query: QueryBlogDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search;

    const [blogs, total] = await Promise.all([
      this.blogsRepository.findManyByAuthor(userId, page, limit, search),
      this.blogsRepository.countByAuthor(userId, search),
    ]);

    const response = {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      blogs,
    };

    return successResponse('User blogs fetched successfully', response);
  }

  async getBlogById(id: string, currentUserId?: string) {
    await this.blogsRepository.incrementViews(id);

    const cacheKey = REDIS_KEYS.BLOG(id);
    const cachedBlog = await this.cacheService.get<any>(cacheKey);

    if (cachedBlog) {
      if (cachedBlog.status !== 'PUBLISHED' && cachedBlog.authorId !== currentUserId) {
        throw new NotFoundException('Blog not found');
      }
      cachedBlog.views += 1;
      return successResponse('Blog fetched successfully', cachedBlog);
    }

    const blog = await this.blogsRepository.findById(id);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (blog.status !== 'PUBLISHED' && blog.authorId !== currentUserId) {
      throw new NotFoundException('Blog not found');
    }

    blog.views += 1;

    await this.cacheService.set(cacheKey, blog, CACHE_TTL.BLOG);

    return successResponse('Blog fetched successfully', blog);
  }

  async updateBlog(
    blogId: string,
    userId: string,
    updateBlogDto: UpdateBlogDto,
    file?: Express.Multer.File,
  ) {
    const existingBlog = await this.blogsRepository.findById(blogId);

    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }

    if (existingBlog.authorId !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to update this blog',
      );
    }

    let slug: string | undefined;

    if (updateBlogDto.title) {
      slug = generateSlug(updateBlogDto.title);
    }

    let thumbnail: string | undefined;

    if (file) {
      try {
        thumbnail = await this.s3Service.uploadFile(file, 'blog-thumbnails');
      } catch (error) {
        throw new BadRequestException('Thumbnail upload failed');
      }
    }

    const updatedBlog = await this.blogsRepository.update(blogId, {
      ...updateBlogDto,

      ...(slug && {
        slug,
      }),

      ...(thumbnail && {
        thumbnail,
      }),

      ...(updateBlogDto.status === 'PUBLISHED' && {
        publishedAt: new Date(),
      }),
    });

    await this.cacheService.deleteByPattern(REDIS_KEYS.ALL_BLOGS);

    await this.cacheService.del(REDIS_KEYS.BLOG(blogId));

    await this.cacheService.del(REDIS_KEYS.FEATURED_BLOGS());

    await this.cacheService.del(REDIS_KEYS.RECENT_BLOGS());

    if (updateBlogDto.status === 'PUBLISHED' && existingBlog.status !== 'PUBLISHED') {
      const authorName =
        `${existingBlog.author?.firstname || ''} ${existingBlog.author?.lastname || ''}`.trim() ||
        existingBlog.author?.username ||
        'Someone';
      await this.notifyFollowers(userId, authorName, updatedBlog);
    }

    return successResponse('Blog updated successfully', updatedBlog);
  }

  async deleteBlog(blogId: string, userId: string) {
    const existingBlog = await this.blogsRepository.findById(blogId);

    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }

    if (existingBlog.authorId !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to delete this blog',
      );
    }

    await this.blogsRepository.delete(blogId);

    await this.cacheService.deleteByPattern(REDIS_KEYS.ALL_BLOGS);

    await this.cacheService.del(REDIS_KEYS.BLOG(blogId));

    await this.cacheService.del(REDIS_KEYS.FEATURED_BLOGS());

    await this.cacheService.del(REDIS_KEYS.RECENT_BLOGS());

    return successResponse('Blog deleted successfully');
  }

  async getExplorePageData() {
    const cacheKey = REDIS_KEYS.EXPLORE;
    const cachedData = await this.cacheService.get(cacheKey);

    if (cachedData) {
      return successResponse('Explore page data fetched successfully', cachedData);
    }

    const dbTags = await this.blogsRepository.findTrendingTags(5);

    const trendingTags = dbTags.map((t) => ({
      label: `#${t.name}`,
      query: t.name,
    }));

    const defaults = [
      { label: '#Rust', query: 'Rust' },
      { label: '#DistributedSystems', query: 'Distributed Systems' },
      { label: '#LLMOps', query: 'LLMOps' },
      { label: '#Wasm', query: 'Wasm' },
      { label: '#Kubernetes', query: 'Kubernetes' },
    ];

    while (trendingTags.length < 5 && defaults.length > 0) {
      const def = defaults.shift();
      if (
        def &&
        !trendingTags.some(
          (t) => t.query.toLowerCase() === def.query.toLowerCase(),
        )
      ) {
        trendingTags.push(def);
      }
    }

    let featuredBlog = await this.blogsRepository.findFeaturedBlog();

    if (!featuredBlog) {
      featuredBlog = await this.blogsRepository.findMostViewedBlog();
    }

    const popularBlogs = await this.blogsRepository.findPopularBlogs(
      2,
      featuredBlog?.id,
    );

    const response = {
      trendingTags,
      featuredBlog,
      popularBlogs,
    };

    await this.cacheService.set(cacheKey, response, 300);

    return successResponse('Explore page data fetched successfully', response);
  }

  async getFeed(query: QueryFeedDto, user?: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const tab = query.tab || 'Latest';
    const tag = query.tag || 'All';

    const cacheKey = REDIS_KEYS.FEED(user?.id, tab, tag, page, limit);
    const cachedData = await this.cacheService.get(cacheKey);

    if (cachedData) {
      return successResponse('Feed fetched successfully', cachedData);
    }

    let followingAuthorIds: string[] = [];

    if (tab === 'Following') {
      if (!user) {
        const response = {
          meta: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
          blogs: [],
        };
        await this.cacheService.set(cacheKey, response, CACHE_TTL.BLOGS);
        return successResponse('Feed fetched successfully', response);
      }

      const follows = await this.prisma.follow.findMany({
        where: {
          followerId: user.id,
        },
        select: {
          followingId: true,
        },
      });

      followingAuthorIds = follows.map((f) => f.followingId);
    }

    const [blogs, total] = await Promise.all([
      this.blogsRepository.findFeed(
        page,
        limit,
        tab,
        tag,
        followingAuthorIds,
      ),
      this.blogsRepository.countFeed(tab, tag, followingAuthorIds),
    ]);

    const response = {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      blogs,
    };

    await this.cacheService.set(cacheKey, response, CACHE_TTL.BLOGS);

    return successResponse('Feed fetched successfully', response);
  }

  async getAllTags() {
    const tags = await this.blogsRepository.getAllTags();
    return successResponse('Tags fetched successfully', tags);
  }

  async getTopContributors() {
    const users = await this.prisma.user.findMany({
      where: {
        blogs: {
          some: {
            status: 'PUBLISHED',
          },
        },
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        bio: true,
        avatar: true,
        blogs: {
          where: {
            status: 'PUBLISHED',
          },
          select: {
            views: true,
          },
        },
      },
    });

    const contributors = users.map((user) => {
      const totalViews = user.blogs.reduce((sum, b) => sum + (b.views || 0), 0);
      return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
        totalViews,
      };
    });

    // Sort descending by totalViews
    contributors.sort((a, b) => b.totalViews - a.totalViews);

    // Take top 4
    const topContributors = contributors.slice(0, 4);

    return successResponse('Top contributors fetched successfully', topContributors);
  }

  private async notifyFollowers(authorId: string, authorName: string, blog: any) {
    try {
      const followers = await this.prisma.follow.findMany({
        where: {
          followingId: authorId,
        },
        select: {
          followerId: true,
        },
      });

      for (const follower of followers) {
        await this.notificationsService.createNotification(
          follower.followerId,
          NotificationType.BLOG_PUBLISHED,
          'New Post Published',
          `${authorName} published a new post: "${blog.title}"`,
        );
      }
    } catch (error) {
      console.error(`Failed to notify followers for blog ${blog.id}:`, error);
    }
  }
}
