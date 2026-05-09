import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class BlogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.BlogCreateInput) {
    return this.prisma.blog.create({
      data,

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
      },
    });
  }

  async findById(id: string) {
    return this.prisma.blog.findUnique({
      where: {
        id,
      },

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

        tags: {
          include: {
            tag: true,
          },
        },

        _count: {
          select: {
            comments: true,
            likes: true,
            bookmarks: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.blog.findUnique({
      where: {
        slug,
      },
    });
  }

  async findMany(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    return this.prisma.blog.findMany({
      where: search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },

              {
                content: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {},

      skip,
      take: limit,

      orderBy: {
        createdAt: 'desc',
      },

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
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async count(search?: string) {
    return this.prisma.blog.count({
      where: search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },

              {
                content: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {},
    });
  }

  async update(id: string, data: Prisma.BlogUpdateInput) {
    return this.prisma.blog.update({
      where: {
        id,
      },

      data,
    });
  }

  async delete(id: string) {
    return this.prisma.blog.delete({
      where: {
        id,
      },
    });
  }

  async incrementViews(id: string) {
    return this.prisma.blog.update({
      where: {
        id,
      },

      data: {
        views: {
          increment: 1,
        },
      },
    });
  }
}
