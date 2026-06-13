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

@Injectable()
export class BlogService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly cacheService: CacheService,
    private readonly s3Service: S3Service,
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

  async getBlogById(id: string) {
    const cacheKey = REDIS_KEYS.BLOG(id);

    const cachedBlog = await this.cacheService.get(cacheKey);

    if (cachedBlog) {
      return successResponse('Blog fetched successfully', cachedBlog);
    }

    const blog = await this.blogsRepository.findById(id);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await this.blogsRepository.incrementViews(id);

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
}
