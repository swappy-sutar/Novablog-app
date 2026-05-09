import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class LikesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findLike(blogId: string, userId: string) {
    return this.prisma.like.findUnique({
      where: {
        blogId_userId: {
          blogId,
          userId,
        },
      },
    });
  }

  async create(blogId: string, userId: string) {
    return this.prisma.like.create({
      data: {
        blogId,
        userId,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.like.delete({
      where: {
        id,
      },
    });
  }

  async count(blogId: string) {
    return this.prisma.like.count({
      where: {
        blogId,
      },
    });
  }
}
