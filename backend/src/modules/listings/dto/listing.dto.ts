import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
  IsBoolean,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export type ListingStatus = 'active' | 'sold' | 'expired' | 'suspended' | 'draft';

// ============================================================================
// LISTING IMAGE DTO
// ============================================================================
export class ListingImageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  thumbnailUrl?: string;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  isPrimary: boolean;

  @ApiProperty()
  createdAt: Date;
}

// ============================================================================
// LISTING ATTRIBUTE DTO
// ============================================================================
export class ListingAttributeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  attributeName: string;

  @ApiProperty()
  attributeValue: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// ============================================================================
// CREATE LISTING DTO
// ============================================================================
export class CreateListingDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Category ID',
  })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example: 'iPhone 13 Pro',
    description: 'Listing title',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({
    example: 'Excellent condition, original charger included',
    description: 'Detailed description',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({
    example: 499.99,
    description: 'Price in USD',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 'Baghdad',
    description: 'City name',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    example: 'Al-Zahra District',
    description: 'Specific location',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'sold', 'expired', 'suspended', 'draft'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['active', 'sold', 'expired', 'suspended', 'draft'])
  status?: ListingStatus;

  @ApiProperty({
    isArray: true,
    type: String,
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    description: 'Array of image URLs',
    required: false,
  })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    example: { color: 'black', memory: '256GB', condition: 'like new' },
    description: 'Dynamic attributes based on category',
    required: false,
  })
  @IsOptional()
  attributes?: Record<string, string>;
}

// ============================================================================
// UPDATE LISTING DTO
// ============================================================================
export class UpdateListingDto extends PartialType(CreateListingDto) {}

// ============================================================================
// COMPLETE LISTING DTO (Response)
// ============================================================================
export class ListingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  city: string;

  @ApiProperty()
  location?: string;

  @ApiProperty()
  status: ListingStatus;

  @ApiProperty()
  views: number;

  @ApiProperty()
  favoritesCount: number;

  @ApiProperty()
  isFeatured: boolean;

  @ApiProperty()
  isTop: boolean;

  @ApiProperty()
  isPromoted: boolean;

  @ApiProperty()
  promotedUntil?: Date;

  @ApiProperty({
    isArray: true,
    type: ListingImageDto,
  })
  images?: ListingImageDto[];

  @ApiProperty({
    isArray: true,
    type: ListingAttributeDto,
  })
  attributes?: ListingAttributeDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  expiresAt: Date;
}

export class ListingReviewSummaryDto {
  @ApiProperty()
  averageRating: number;

  @ApiProperty()
  totalReviews: number;
}

export class ListingReviewPreviewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reviewerId: string;

  @ApiProperty()
  reviewedUserId: string;

  @ApiProperty()
  listingId: string;

  @ApiProperty()
  rating: number;

  @ApiProperty({ required: false })
  comment?: string;

  @ApiProperty()
  createdAt: Date;
}

export class ListingDetailsDto extends ListingDto {
  @ApiProperty({ type: ListingReviewSummaryDto })
  reviewSummary: ListingReviewSummaryDto;

  @ApiProperty({ isArray: true, type: ListingReviewPreviewDto })
  reviews: ListingReviewPreviewDto[];
}

// ============================================================================
// PAGINATED LISTINGS RESPONSE DTO
// ============================================================================
export class ListingsResponseDto {
  @ApiProperty({
    isArray: true,
    type: ListingDto,
  })
  data: ListingDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}

// ============================================================================
// LISTING FILTERS DTO
// ============================================================================
export class ListingFiltersDto {
  @ApiProperty({
    required: false,
    description: 'Category ID to filter by',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({
    required: false,
    description: 'City to filter by',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    required: false,
    description: 'Minimum price',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiProperty({
    required: false,
    description: 'Maximum price',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({
    required: false,
    description: 'Search query for title and description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Sort field (createdAt, price, views)',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'price' | 'views';

  @ApiProperty({
    required: false,
    description: 'Sort order (ASC, DESC)',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}

// ============================================================================
// ADD IMAGE DTO
// ============================================================================
export class AddListingImageDto {
  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Image URL',
  })
  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @ApiProperty({
    example: 'https://example.com/image-thumb.jpg',
    description: 'Thumbnail URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({
    example: 0,
    description: 'Sort order',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({
    example: true,
    description: 'Is primary image',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

// ============================================================================
// PROMOTE LISTING DTO
// ============================================================================
export class PromoteListingDto {
  @ApiProperty({
    example: 'active',
    enum: ['active', 'top', 'featured'],
    description: 'Promotion type',
  })
  @IsNotEmpty()
  @IsEnum(['active', 'top', 'featured'])
  type: 'active' | 'top' | 'featured';

  @ApiProperty({
    example: '2026-05-30',
    description: 'Promotion end date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  promotedUntil?: string;
}
