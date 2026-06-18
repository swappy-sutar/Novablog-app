import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CommentCreateInput) {
    return this.prisma.comment.create({
      data,

      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            username: true,
            avatar: true,
          },
        },

        replies: {
          include: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.comment.findUnique({
      where: {
        id,
      },

      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            username: true,
            avatar: true,
          },
        },

        replies: {
          include: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                avatar: true,
              },
            },
          },

          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  async findByBlogId(blogId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    return this.prisma.comment.findMany({
      where: {
        blogId,

        parentId: null,
      },

      skip,
      take: limit,

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            username: true,
            avatar: true,
          },
        },

        replies: {
          include: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                avatar: true,
              },
            },

            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    username: true,
                    avatar: true,
                  },
                },
              },

              orderBy: {
                createdAt: 'asc',
              },
            },
          },

          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  async count(blogId: string) {
    return this.prisma.comment.count({
      where: {
        blogId,
        parentId: null,
      },
    });
  }

  async update(id: string, data: Prisma.CommentUpdateInput) {
    return this.prisma.comment.update({
      where: {
        id,
      },

      data,

      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.comment.delete({
      where: {
        id,
      },
    });
  }
}
