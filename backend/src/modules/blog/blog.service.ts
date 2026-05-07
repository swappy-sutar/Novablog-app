import { BadRequestException, Injectable } from '@nestjs/common';
import { BlogsRepository } from './repository/blog.repository';
import { CacheService } from 'src/config/redis.config/cache.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { successResponse } from 'src/common/helpers/response.helper';
import { generateSlug } from 'src/common/utils/slug.util';
import { REDIS_KEYS } from 'src/config/redis.config/redis.keys';
import { S3Service } from 'src/config/s3.config/s3.service';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly cacheService: CacheService,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    userId: string,
    createBlogDto: CreateBlogDto,
    file?: Express.Multer.File,
  ) {
    const slug = generateSlug(createBlogDto.title);

    const existingBlog = await this.blogsRepository.findBySlug(slug);
    let finalSlug = slug;

    if (existingBlog) {
      finalSlug = `${slug}-${Date.now()}`;
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
      thumbnail: thumbnail,
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

    await this.cacheService.del(REDIS_KEYS.RECENT_BLOGS);

    await this.cacheService.del(REDIS_KEYS.FEATURED_BLOGS);

    return successResponse('Blog created successfully', blog, 201);
  }
}
