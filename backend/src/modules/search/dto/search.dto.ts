import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// SEARCH QUERY DTO
// ============================================================================
export class SearchQueryDto {
  @ApiProperty({
    example: 'iPhone 13',
    description: 'Search query text',
    required: false,
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({
    example: 'cars',
    description: 'Category slug or ID to filter by',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 'Baghdad',
    description: 'City to filter by',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: 100,
    description: 'Minimum price',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    example: 10000,
    description: 'Maximum price',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({
    example: 'createdAt',
    description: 'Sort field (createdAt, price, views, relevance)',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'price' | 'views' | 'relevance';

  @ApiProperty({
    example: 'desc',
    description: 'Sort order (asc, desc)',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiProperty({
    example: 1,
    description: 'Page number',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    example: 20,
    description: 'Results per page',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @ApiProperty({
    example: true,
    description: 'Get facets/aggregations',
    required: false,
  })
  @IsOptional()
  includeFacets?: boolean;
}

// ============================================================================
// SEARCH RESULT ITEM DTO
// ============================================================================
export class SearchResultItemDto {
  @ApiProperty()
  id: string;

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
  status: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  userRating: number;

  @ApiProperty()
  isFeatured: boolean;

  @ApiProperty()
  isTop: boolean;

  @ApiProperty()
  views: number;

  @ApiProperty()
  favoritesCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  primaryImage?: string;

  @ApiProperty()
  score?: number;
}

// ============================================================================
// FACET DTO
// ============================================================================
export class FacetDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  count: number;
}

// ============================================================================
// SEARCH FACETS DTO
// ============================================================================
export class SearchFacetsDto {
  @ApiProperty({
    isArray: true,
    type: FacetDto,
  })
  categories: FacetDto[];

  @ApiProperty({
    isArray: true,
    type: FacetDto,
  })
  cities: FacetDto[];

  @ApiProperty()
  priceRange: {
    min: number;
    max: number;
  };
}

// ============================================================================
// SEARCH RESPONSE DTO
// ============================================================================
export class SearchResponseDto {
  @ApiProperty({
    isArray: true,
    type: SearchResultItemDto,
  })
  results: SearchResultItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  query: string;

  @ApiProperty()
  executionTime: number;

  @ApiProperty()
  facets?: SearchFacetsDto;
}

// ============================================================================
// AUTOCOMPLETE SUGGESTION DTO
// ============================================================================
export class AutocompleteDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  type: 'title' | 'category' | 'city';
}

// ============================================================================
// AUTOCOMPLETE RESPONSE DTO
// ============================================================================
export class AutocompleteResponseDto {
  @ApiProperty({
    isArray: true,
    type: AutocompleteDto,
  })
  suggestions: AutocompleteDto[];
}

// ============================================================================
// POPULAR SEARCHES DTO
// ============================================================================
export class PopularSearchDto {
  @ApiProperty()
  query: string;

  @ApiProperty()
  count: number;
}

// ============================================================================
// POPULAR SEARCHES RESPONSE DTO
// ============================================================================
export class PopularSearchesResponseDto {
  @ApiProperty({
    isArray: true,
    type: PopularSearchDto,
  })
  searches: PopularSearchDto[];
}

// ============================================================================
// SEARCH SUGGESTION DTO (for autocomplete)
// ============================================================================
export class SearchSuggestionDto {
  @ApiProperty({
    example: 'iphone',
    description: 'Suggestion text',
  })
  text: string;

  @ApiProperty({
    example: 45,
    description: 'Number of listings matching this suggestion',
  })
  count: number;

  @ApiProperty({
    example: 'title',
    description: 'Type of suggestion (title, category, city)',
  })
  type: 'title' | 'category' | 'city';
}

// ============================================================================
// TRENDING SEARCHES RESPONSE DTO
// ============================================================================
export class TrendingSearchesResponseDto {
  @ApiProperty({
    isArray: true,
    type: PopularSearchDto,
  })
  trending: PopularSearchDto[];

  @ApiProperty()
  lastUpdated: Date;
}
