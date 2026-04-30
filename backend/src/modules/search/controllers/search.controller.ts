import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SearchService } from '../services/search.service';
import {
  SearchQueryDto,
  SearchResponseDto,
  AutocompleteResponseDto,
  PopularSearchesResponseDto,
} from '../dto/search.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Search')
@Controller('api/v1/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * Search listings with advanced filters
   */
  @Get()
  @ApiOperation({ summary: 'Search listings with Elasticsearch' })
  @ApiQuery({ name: 'q', description: 'Search query', required: false })
  @ApiQuery({ name: 'category', description: 'Category ID or slug', required: false })
  @ApiQuery({ name: 'city', description: 'City name', required: false })
  @ApiQuery({ name: 'minPrice', description: 'Minimum price', required: false })
  @ApiQuery({ name: 'maxPrice', description: 'Maximum price', required: false })
  @ApiQuery({ name: 'sortBy', description: 'Sort by (createdAt, price, views, relevance)', required: false })
  @ApiQuery({ name: 'sortOrder', description: 'Sort order (asc, desc)', required: false })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiQuery({ name: 'pageSize', description: 'Results per page', required: false })
  @ApiQuery({ name: 'includeFacets', description: 'Include facets/aggregations', required: false })
  @ApiResponse({
    status: 200,
    description: 'Search results',
    type: SearchResponseDto,
  })
  async search(@Query() query: SearchQueryDto): Promise<SearchResponseDto> {
    return this.searchService.search(query);
  }

  /**
   * Get autocomplete suggestions
   */
  @Get('autocomplete')
  @ApiOperation({ summary: 'Get autocomplete suggestions' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiQuery({ name: 'limit', description: 'Number of suggestions', required: false })
  @ApiResponse({
    status: 200,
    description: 'Autocomplete suggestions',
    type: AutocompleteResponseDto,
  })
  async autocomplete(
    @Query('q') query: string,
    @Query('limit') limit: number = 10,
  ): Promise<AutocompleteResponseDto> {
    return this.searchService.getAutocomplete(query, limit);
  }

  /**
   * Get popular searches
   */
  @Get('popular')
  @ApiOperation({ summary: 'Get popular searches' })
  @ApiQuery({ name: 'limit', description: 'Number of searches', required: false })
  @ApiResponse({
    status: 200,
    description: 'Popular searches',
    type: PopularSearchesResponseDto,
  })
  async popular(@Query('limit') limit: number = 10): Promise<PopularSearchesResponseDto> {
    return this.searchService.getPopularSearches(limit);
  }

  /**
   * Index all listings (Admin only)
   */
  @Post('reindex')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reindex all listings in Elasticsearch' })
  @ApiResponse({
    status: 200,
    description: 'Reindexing started',
  })
  async reindex(): Promise<{ indexed: number; failed: number; message: string }> {
    const result = await this.searchService.indexAllListings();
    return {
      ...result,
      message: `Indexed ${result.indexed} listings, ${result.failed} failed`,
    };
  }

  /**
   * Check search health
   */
  @Get('health')
  @ApiOperation({ summary: 'Check Elasticsearch health' })
  @ApiResponse({
    status: 200,
    description: 'Elasticsearch health status',
  })
  async health(): Promise<{ healthy: boolean; message: string }> {
    return this.searchService.healthCheck();
  }

  /**
   * Advanced search with filters (alternative endpoint)
   */
  @Post('advanced')
  @ApiOperation({ summary: 'Advanced search with detailed filters' })
  @ApiResponse({
    status: 200,
    description: 'Search results',
    type: SearchResponseDto,
  })
  async advancedSearch(@Query() query: SearchQueryDto): Promise<SearchResponseDto> {
    // Include facets by default for advanced search
    query.includeFacets = true;
    return this.searchService.search(query);
  }
}
