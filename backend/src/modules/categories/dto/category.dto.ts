import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Matches, IsInt, IsBoolean } from 'class-validator';

// ============================================================================
// CREATE CATEGORY DTO
// ============================================================================
export class CreateCategoryDto {
  @ApiProperty({
    example: 'Cars',
    description: 'Category name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'cars',
    description: 'URL-friendly slug',
  })
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug: string;

  @ApiProperty({
    example: 'Buy and sell vehicles',
    description: 'Category description',
    required: false,
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'car-icon-url',
    description: 'Icon URL',
    required: false,
  })
  @IsOptional()
  icon?: string;

  @ApiProperty({
    example: 'category-image-url',
    description: 'Category image URL',
    required: false,
  })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: 1,
    description: 'Sort order for display',
    required: false,
  })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiProperty({
    example: true,
    description: 'Is category active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ============================================================================
// UPDATE CATEGORY DTO
// ============================================================================
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

// ============================================================================
// CATEGORY RESPONSE DTO
// ============================================================================
export class CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  icon?: string;

  @ApiProperty()
  imageUrl?: string;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// ============================================================================
// PAGINATED CATEGORIES RESPONSE DTO
// ============================================================================
export class CategoriesResponseDto {
  @ApiProperty({
    isArray: true,
    type: CategoryDto,
  })
  data: CategoryDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}
