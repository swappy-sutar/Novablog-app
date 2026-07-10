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

      case 'new-follower':
        await this.mailProvider.sendNewFollowerEmail(
          job.data.email,
          job.data.firstname,
          job.data.followerName,
          job.data.followerUsername,
          job.data.followerBio,
          job.data.followerInitial,
          job.data.profileLink,
        );

        break;

      case 'new-comment':
        await this.mailProvider.sendNewCommentEmail(
          job.data.email,
          job.data.firstname,
          job.data.commenterName,
          job.data.blogTitle,
          job.data.commentContent,
          job.data.blogLink,
        );

        break;

      case 'weekly-newsletter':
        await this.mailProvider.sendWeeklyNewsletterEmail(
          job.data.email,
          job.data.firstname,
          job.data.articles,
        );

        break;

      case 'custom-newsletter':
        await this.mailProvider.sendCustomNewsletterEmail(
          job.data.email,
          job.data.subject,
          job.data.content,
        );

        break;
    }
  }
}
