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
      where: {
        status: 'PUBLISHED',
        ...(search && {
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
            {
              category: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
            {
              tags: {
                some: {
                  tag: {
                    name: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
          ],
        }),
      },

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
      where: {
        status: 'PUBLISHED',
        ...(search && {
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
            {
              category: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
            {
              tags: {
                some: {
                  tag: {
                    name: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
          ],
        }),
      },
    });
  }

  async findManyByAuthor(authorId: string, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.BlogWhereInput = {
      authorId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    return this.prisma.blog.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
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

  async countByAuthor(authorId: string, search?: string) {
    const whereClause: Prisma.BlogWhereInput = {
      authorId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    return this.prisma.blog.count({
      where: whereClause,
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

  async findTrendingTags(take: number) {
    return this.prisma.tag.findMany({
      take,
      orderBy: {
        blogs: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }

  async findFeaturedBlog() {
    return this.prisma.blog.findFirst({
      where: {
        isFeatured: true,
        status: 'PUBLISHED',
      },
      orderBy: {
        publishedAt: 'desc',
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
      },
    });
  }

  async findMostViewedBlog() {
    return this.prisma.blog.findFirst({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        views: 'desc',
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
      },
    });
  }

  async findPopularBlogs(take: number, excludeId?: string) {
    return this.prisma.blog.findMany({
      where: {
        status: 'PUBLISHED',
        ...(excludeId && {
          id: {
            not: excludeId,
          },
        }),
      },
      orderBy: {
        views: 'desc',
      },
      take,
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

  async findFeed(page: number, limit: number, tab: 'Latest' | 'Trending' | 'Following', tag: string, followingAuthorIds?: string[]) {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.BlogWhereInput = {
      status: 'PUBLISHED',
    };

    if (tag && tag !== 'All') {
      whereClause.OR = [
        {
          tags: {
            some: {
              tag: {
                name: {
                  equals: tag,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
        {
          title: {
            contains: tag,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: tag,
            mode: 'insensitive',
          },
        },
        {
          category: {
            name: {
              contains: tag,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    if (tab === 'Following') {
      whereClause.authorId = {
        in: followingAuthorIds || [],
      };
    }

    let orderByClause: Prisma.BlogOrderByWithRelationInput = {
      createdAt: 'desc',
    };

    if (tab === 'Trending') {
      orderByClause = {
        views: 'desc',
      };
    }

    return this.prisma.blog.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: orderByClause,
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
      },
    });
  }

  async countFeed(tab: 'Latest' | 'Trending' | 'Following', tag: string, followingAuthorIds?: string[]) {
    const whereClause: Prisma.BlogWhereInput = {
      status: 'PUBLISHED',
    };

    if (tag && tag !== 'All') {
      whereClause.OR = [
        {
          tags: {
            some: {
              tag: {
                name: {
                  equals: tag,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
        {
          title: {
            contains: tag,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: tag,
            mode: 'insensitive',
          },
        },
        {
          category: {
            name: {
              contains: tag,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    if (tab === 'Following') {
      whereClause.authorId = {
        in: followingAuthorIds || [],
      };
    }

    return this.prisma.blog.count({
      where: whereClause,
    });
  }

  async getAllTags() {
    return this.prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
