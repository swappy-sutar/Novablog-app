import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class BookmarksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBookmark(blogId: string, userId: string) {
    return this.prisma.bookmark.findUnique({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    });
  }

  async create(blogId: string, userId: string) {
    return this.prisma.bookmark.create({
      data: {
        blogId,
        userId,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.bookmark.delete({
      where: {
        id,
      },
    });
  }

  async findUserBookmarks(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },

      skip,
      take: limit,

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        blog: {
          include: {
            author: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                avatar: true,
              },
            },

            category: true,

            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
    });
  }

  async countUserBookmarks(userId: string) {
    return this.prisma.bookmark.count({
      where: {
        userId,
      },
    });
  }
}
