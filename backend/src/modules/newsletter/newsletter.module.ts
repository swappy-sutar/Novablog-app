import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { NewsletterRepository } from './repository/newsletter.repository';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { JobsEmailModule } from 'src/jobs/email/email.module';

@Module({
  imports: [PrismaModule, JobsEmailModule],
  controllers: [NewsletterController],
  providers: [NewsletterService, NewsletterRepository],
  exports: [NewsletterService],
})
export class NewsletterModule {}
