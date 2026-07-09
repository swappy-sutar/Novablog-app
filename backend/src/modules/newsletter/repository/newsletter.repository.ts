import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class NewsletterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.newsletterSubscription.findUnique({
      where: { email },
    });
  }

  async create(email: string) {
    return this.prisma.newsletterSubscription.create({
      data: { email },
    });
  }

  async updateStatus(email: string, isActive: boolean) {
    return this.prisma.newsletterSubscription.update({
      where: { email },
      data: { isActive },
    });
  }
}
