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
}
