import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { NewsletterRepository } from './repository/newsletter.repository';
import { EmailService } from 'src/jobs/email/email.service';
import { successResponse } from 'src/common/helpers/response.helper';

@Injectable()
export class NewsletterService {
  constructor(
    private readonly newsletterRepository: NewsletterRepository,
    private readonly emailService: EmailService,
  ) {}

  async subscribe(email: string) {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      throw new BadRequestException('Email cannot be empty');
    }

    const existing = await this.newsletterRepository.findByEmail(trimmedEmail);
    if (existing) {
      if (existing.isActive) {
        throw new ConflictException('You are already subscribed to our newsletter!');
      } else {
        await this.newsletterRepository.updateStatus(trimmedEmail, true);
        return successResponse('Successfully resubscribed to the newsletter!', {
          email: trimmedEmail,
          isActive: true,
        });
      }
    }

    const subscription = await this.newsletterRepository.create(trimmedEmail);
    return successResponse('Successfully subscribed to the newsletter!', subscription);
  }

  async unsubscribe(email: string) {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      throw new BadRequestException('Email cannot be empty');
    }

    const existing = await this.newsletterRepository.findByEmail(trimmedEmail);
    if (!existing) {
      throw new NotFoundException('Subscription not found');
    }

    await this.newsletterRepository.updateStatus(trimmedEmail, false);
    return successResponse('Successfully unsubscribed from the newsletter!', {
      email: trimmedEmail,
      isActive: false,
    });
  }

  async getSubscribers() {
    const subscribers = await this.newsletterRepository.findAllSubscribers();
    return successResponse('Subscribers retrieved successfully', subscribers);
  }

  async toggleSubscriberStatus(id: string, isActive: boolean) {
    const updated = await this.newsletterRepository.updateStatusById(id, isActive);
    return successResponse('Subscriber status updated successfully', updated);
  }

  async deleteSubscriber(id: string) {
    await this.newsletterRepository.deleteSubscriberById(id);
    return successResponse('Subscriber deleted successfully');
  }

  async sendNewsletter(subject: string, content: string) {
    if (!subject || !content) {
      throw new BadRequestException('Subject and Content are required');
    }

    const subscribers = await this.newsletterRepository.findAllSubscribers();
    const activeSubscribers = subscribers.filter((s) => s.isActive);

    if (activeSubscribers.length === 0) {
      throw new BadRequestException('No active subscribers to send the newsletter to');
    }

    // Queue custom newsletter for each subscriber
    for (const sub of activeSubscribers) {
      await this.emailService.sendCustomNewsletterEmail({
        email: sub.email,
        subject,
        content,
      });
    }

    // Store in history
    const record = await this.newsletterRepository.createNewsletterRecord(
      subject,
      content,
      activeSubscribers.length,
    );

    return successResponse(`Newsletter queued successfully for ${activeSubscribers.length} subscribers`, record);
  }

  async sendTestEmail(email: string, subject: string, content: string) {
    if (!email || !subject || !content) {
      throw new BadRequestException('Email, Subject, and Content are required');
    }

    await this.emailService.sendCustomNewsletterEmail({
      email: email.trim().toLowerCase(),
      subject,
      content,
    });

    return successResponse('Test email sent successfully');
  }

  async getHistory() {
    const history = await this.newsletterRepository.getNewsletterHistory();
    return successResponse('Newsletter history retrieved successfully', history);
  }
}
