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

  async findAllSubscribers() {
    return this.prisma.newsletterSubscription.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatusById(id: string, isActive: boolean) {
    return this.prisma.newsletterSubscription.update({
      where: { id },
      data: { isActive },
    });
  }

  async deleteSubscriberById(id: string) {
    return this.prisma.newsletterSubscription.delete({
      where: { id },
    });
  }

  async createNewsletterRecord(subject: string, content: string, sentTo: number) {
    return this.prisma.newsletter.create({
      data: { subject, content, sentTo },
    });
  }

  async getNewsletterHistory() {
    return this.prisma.newsletter.findMany({
      orderBy: { sentAt: 'desc' },
    });
  }
}
