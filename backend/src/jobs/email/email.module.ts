import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { MailModule } from '../../providers/email/mail.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
    MailModule,
  ],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class JobsEmailModule {}
