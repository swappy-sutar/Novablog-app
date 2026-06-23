import { Processor, WorkerHost } from '@nestjs/bullmq';

import type { Job } from 'bullmq';

import { MailProvider } from '../../providers/email/mail.provider';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailProvider: MailProvider) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'welcome-email':
        await this.mailProvider.sendWelcomeEmail(
          job.data.email,
          job.data.firstname,
        );

        break;

      case 'forgot-password':
        await this.mailProvider.sendForgotPasswordEmail(
          job.data.email,
          job.data.firstname,
          job.data.resetLink,
        );

        break;

      case 'verify-email':
        await this.mailProvider.sendVerifyEmail(
          job.data.email,
          job.data.firstname,
          job.data.verifyLink,
        );

        break;
    }
  }
}
