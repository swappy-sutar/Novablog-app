import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CommentsRepository } from './repository/comments.repository';

import { BlogsRepository } from '../blog/repository/blog.repository';

import { CacheService } from 'src/config/redis/cache.service';

import { CreateCommentDto } from './dto/create-comment.dto';

import { successResponse } from 'src/common/helpers/response.helper';

import { UpdateCommentDto } from './dto/update-comment.dto';

import { QueryCommentDto } from './dto/query-comment.dto';

import { REDIS_KEYS } from 'src/config/redis/redis.keys';

import { CACHE_TTL } from 'src/config/redis/redis.ttl';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentsRepository,

    private readonly blogsRepository: BlogsRepository,

    private readonly cacheService: CacheService,
  ) {}

  async createComment(
    blogId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const blog = await this.blogsRepository.findById(blogId);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (createCommentDto.parentId) {
      const parentComment = await this.commentRepository.findById(
        createCommentDto.parentId,
      );

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const comment = await this.commentRepository.create({
      content: createCommentDto.content,

      blog: {
        connect: {
          id: blogId,
        },
      },

      user: {
        connect: {
          id: userId,
        },
      },

      ...(createCommentDto.parentId && {
        parent: {
          connect: {
            id: createCommentDto.parentId,
          },
        },
      }),
    });

    await this.cacheService.deleteByPattern(REDIS_KEYS.ALL_COMMENTS(blogId));

    return successResponse('Comment created successfully', comment, 201);
  }

  async getCommentsByBlog(blogId: string, query: QueryCommentDto) {
    const blog = await this.blogsRepository.findById(blogId);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const page = Number(query.page) || 1;

    const limit = Number(query.limit) || 10;

    const cacheKey = REDIS_KEYS.COMMENTS(blogId, page, limit);

    const cachedComments = await this.cacheService.get(cacheKey);

    if (cachedComments) {
      return successResponse('Comments fetched successfully', cachedComments);
    }

    const [comments, total] = await Promise.all([
      this.commentRepository.findByBlogId(blogId, page, limit),

      this.commentRepository.count(blogId),
    ]);

    const response = {
      comments,

      meta: {
        total,
        page,
        limit,

        totalPages: Math.ceil(total / limit),
      },
    };

    await this.cacheService.set(cacheKey, response, CACHE_TTL.COMMENTS);

    return successResponse('Comments fetched successfully', response);
  }

  async updateComment(
    commentId: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const existingComment = await this.commentRepository.findById(commentId);

    if (!existingComment) {
      throw new NotFoundException('Comment not found');
    }

    if (existingComment.userId !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to update this comment',
      );
    }

    if (!updateCommentDto.content) {
      throw new BadRequestException('Content is required');
    }

    const updatedComment = await this.commentRepository.update(commentId, {
      content: updateCommentDto.content,
    });

    await this.cacheService.deleteByPattern(
      REDIS_KEYS.ALL_COMMENTS(existingComment.blogId),
    );

    return successResponse('Comment updated successfully', updatedComment);
  }

  async deleteComment(commentId: string, userId: string) {
    const existingComment = await this.commentRepository.findById(commentId);

    if (!existingComment) {
      throw new NotFoundException('Comment not found');
    }

    if (existingComment.userId !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to delete this comment',
      );
    }

    await this.commentRepository.delete(commentId);

    await this.cacheService.deleteByPattern(
      REDIS_KEYS.ALL_COMMENTS(existingComment.blogId),
    );

    return successResponse('Comment deleted successfully');
  }
}
