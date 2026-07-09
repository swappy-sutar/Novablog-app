import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateReviewDto } from '../dto/create-review.dto';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewDto) {
    return this.prisma.review.create({
      data,
    });
  }

  async findActive() {
    return this.prisma.review.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
