import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { User } from '../../users/entities/user.entity';
import { Listing } from '../../listings/entities/listing.entity';
import {
  CreateReviewDto,
  ReviewDto,
  ReviewsResponseDto,
  UserRatingSummaryDto,
} from '../dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
  ) {}

  async create(reviewerId: string, dto: CreateReviewDto): Promise<ReviewDto> {
    if (reviewerId === dto.reviewedUserId) {
      throw new BadRequestException('You cannot review yourself');
    }

    const [reviewedUser, listing] = await Promise.all([
      this.usersRepository.findOne({ where: { id: dto.reviewedUserId } }),
      this.listingsRepository.findOne({ where: { id: dto.listingId } }),
    ]);

    if (!reviewedUser) {
      throw new NotFoundException(`User with id '${dto.reviewedUserId}' not found`);
    }

    if (!listing) {
      throw new NotFoundException(`Listing with id '${dto.listingId}' not found`);
    }

    if (listing.userId !== dto.reviewedUserId) {
      throw new BadRequestException('The reviewed user must own the reviewed listing');
    }

    const existing = await this.reviewsRepository.findOne({
      where: { reviewerId, listingId: dto.listingId },
    });
    if (existing) {
      throw new ConflictException('You have already reviewed this listing');
    }

    const review = await this.reviewsRepository.save({
      reviewerId,
      reviewedUserId: dto.reviewedUserId,
      listingId: dto.listingId,
      rating: dto.rating,
      comment: dto.comment,
    });

    await this.recalculateUserRating(dto.reviewedUserId);
    return this.mapReview(review);
  }

  async findForUser(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<ReviewsResponseDto> {
    const skip = (page - 1) * pageSize;
    const [reviews, total] = await this.reviewsRepository.findAndCount({
      where: { reviewedUserId: userId },
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return this.paginate(reviews, total, page, pageSize);
  }

  async findForListing(
    listingId: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<ReviewsResponseDto> {
    const skip = (page - 1) * pageSize;
    const [reviews, total] = await this.reviewsRepository.findAndCount({
      where: { listingId },
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return this.paginate(reviews, total, page, pageSize);
  }

  async summary(userId: string): Promise<UserRatingSummaryDto> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id '${userId}' not found`);
    }

    return {
      userId,
      rating: Number(user.rating || 0),
      totalReviews: user.totalReviews || 0,
    };
  }

  async delete(reviewId: string, reviewerId: string): Promise<{ message: string }> {
    const review = await this.reviewsRepository.findOne({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException(`Review with id '${reviewId}' not found`);
    }

    if (review.reviewerId !== reviewerId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const reviewedUserId = review.reviewedUserId;
    await this.reviewsRepository.remove(review);
    await this.recalculateUserRating(reviewedUserId);

    return { message: 'Review deleted successfully' };
  }

  private async recalculateUserRating(userId: string): Promise<void> {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'rating')
      .addSelect('COUNT(review.id)', 'totalReviews')
      .where('review.reviewedUserId = :userId', { userId })
      .getRawOne();

    await this.usersRepository.update(userId, {
      rating: Number(result.rating || 0),
      totalReviews: Number(result.totalReviews || 0),
    });
  }

  private paginate(
    reviews: Review[],
    total: number,
    page: number,
    pageSize: number,
  ): ReviewsResponseDto {
    return {
      data: reviews.map((review) => this.mapReview(review)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  private mapReview(review: Review): ReviewDto {
    return {
      id: review.id,
      reviewerId: review.reviewerId,
      reviewedUserId: review.reviewedUserId,
      listingId: review.listingId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    };
  }
}
