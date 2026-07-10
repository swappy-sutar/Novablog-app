import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email')
    private readonly emailQueue: Queue,
  ) {}

  async sendWelcomeEmail(email: string, firstname: string) {
    await this.emailQueue.add(
      'welcome-email',
      {
        email,
        firstname,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: true,
      },
    );
  }

  async sendForgotPasswordEmail(
    email: string,
    firstname: string,
    resetLink: string,
  ) {
    await this.emailQueue.add(
      'forgot-password',
      {
        email,
        firstname,
        resetLink,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: true,
      },
    );
  }

  async sendVerifyEmail(
    email: string,
    firstname: string,
    verifyLink: string,
  ) {
    await this.emailQueue.add(
      'verify-email',
      {
        email,
        firstname,
        verifyLink,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: true,
      },
    );
  }

  async sendNewFollowerEmail(data: {
    email: string;
    firstname: string;
    followerName: string;
    followerUsername: string;
    followerBio: string;
    followerInitial: string;
    profileLink: string;
  }) {
    await this.emailQueue.add(
      'new-follower',
      data,
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: true,
      },
    );
  }

  async sendNewCommentEmail(data: {
    email: string;
    firstname: string;
    commenterName: string;
    blogTitle: string;
    commentContent: string;
    blogLink: string;
  }) {
    await this.emailQueue.add(
      'new-comment',
      data,
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: true,
      },
    );
  }

  async sendWeeklyNewsletterEmail(data: {
    email: string;
    firstname: string;
    articles: {
      title: string;
      excerpt: string;
      link: string;
      category: string;
    }[];
  }) {
    await this.emailQueue.add(
      'weekly-newsletter',
      data,
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: true,
      },
    );
  }
}
