import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './repository/review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { successResponse } from 'src/common/helpers/response.helper';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async createReview(dto: CreateReviewDto) {
    const review = await this.reviewRepository.create(dto);
    return successResponse('Thank you! Your review has been submitted successfully.', review);
  }

  async getReviews() {
    const reviews = await this.reviewRepository.findActive();
    return successResponse('Reviews fetched successfully', reviews);
  }
}
