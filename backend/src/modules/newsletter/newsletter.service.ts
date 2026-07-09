import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { NewsletterRepository } from './repository/newsletter.repository';
import { successResponse } from 'src/common/helpers/response.helper';

@Injectable()
export class NewsletterService {
  constructor(private readonly newsletterRepository: NewsletterRepository) {}

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
}
