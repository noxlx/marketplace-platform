import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ReviewsService } from '../services/reviews.service';
import {
  CreateReviewDto,
  ReviewDto,
  ReviewsResponseDto,
  UserRatingSummaryDto,
} from '../dto/review.dto';

@ApiTags('Reviews')
@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a review for a listing seller' })
  @ApiResponse({ status: 201, type: ReviewDto })
  async create(
    @CurrentUser() reviewerId: string,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewDto> {
    return this.reviewsService.create(reviewerId, createReviewDto);
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get reviews received by a user' })
  @ApiParam({ name: 'userId', description: 'Reviewed user ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, type: ReviewsResponseDto })
  async findForUser(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ): Promise<ReviewsResponseDto> {
    return this.reviewsService.findForUser(userId, page, pageSize);
  }

  @Get('users/:userId/summary')
  @ApiOperation({ summary: 'Get a user rating summary' })
  @ApiParam({ name: 'userId', description: 'Reviewed user ID' })
  @ApiResponse({ status: 200, type: UserRatingSummaryDto })
  async summary(@Param('userId') userId: string): Promise<UserRatingSummaryDto> {
    return this.reviewsService.summary(userId);
  }

  @Get('listings/:listingId')
  @ApiOperation({ summary: 'Get reviews for a listing' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, type: ReviewsResponseDto })
  async findForListing(
    @Param('listingId') listingId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ): Promise<ReviewsResponseDto> {
    return this.reviewsService.findForListing(listingId, page, pageSize);
  }

  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete my review' })
  @ApiParam({ name: 'reviewId', description: 'Review ID' })
  async delete(
    @CurrentUser() reviewerId: string,
    @Param('reviewId') reviewId: string,
  ): Promise<{ message: string }> {
    return this.reviewsService.delete(reviewId, reviewerId);
  }
}
