import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
      },
    });
  }

  async findMany(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    return this.prisma.user.findMany({
      where: search
        ? {
            OR: [
              {
                firstname: {
                  contains: search,
                  mode: 'insensitive',
                },
              },

              {
                lastname: {
                  contains: search,
                  mode: 'insensitive',
                },
              },

              {
                username: {
                  contains: search,
                  mode: 'insensitive',
                },
              },

              {
                email: {
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

      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }
  async count(search?: string): Promise<number> {
    return this.prisma.user.count({
      where: search
        ? {
            OR: [
              {
                firstname: {
                  contains: search,
                  mode: 'insensitive',
                },
              },

              {
                lastname: {
                  contains: search,
                  mode: 'insensitive',
                },
              },

              {
                username: {
                  contains: search,
                  mode: 'insensitive',
                },
              },

              {
                email: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {},
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },

      data,
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        refreshToken,
      },
    });
  }

  async verifyUser(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        isVerified: true,
      },
    });
  }

  async updateAvatar(userId: string, avatar: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        avatar,
      },
    });
  }

  async deactivateUser(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        isActive: false,
      },
    });
  }
}
