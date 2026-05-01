import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ListingsService } from '../services/listings.service';
import {
  CreateListingDto,
  UpdateListingDto,
  ListingDto,
  ListingDetailsDto,
  ListingsResponseDto,
  ListingFiltersDto,
  AddListingImageDto,
  PromoteListingDto,
} from '../dto/listing.dto';

@ApiTags('Listings')
@Controller('api/v1/listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  /**
   * Create a new listing
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new listing' })
  @ApiResponse({
    status: 201,
    description: 'Listing created successfully',
    type: ListingDto,
  })
  async create(
    @CurrentUser() userId: string,
    @Body() createListingDto: CreateListingDto,
  ): Promise<ListingDto> {
    return this.listingsService.create(userId, createListingDto);
  }

  /**
   * Get all listings with filters
   */
  @Get()
  @ApiOperation({ summary: 'Get all listings' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Listings retrieved successfully',
    type: ListingsResponseDto,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Query() filters: ListingFiltersDto,
  ) {
    return this.listingsService.findAll(page, pageSize, filters);
  }

  /**
   * Get featured listings
   */
  @Get('featured/top')
  @ApiOperation({ summary: 'Get featured listings' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Featured listings',
    type: [ListingDto],
  })
  async getFeatured(@Query('limit') limit: number = 12): Promise<ListingDto[]> {
    return this.listingsService.getFeatured(limit);
  }

  /**
   * Search listings
   */
  @Get('search')
  @ApiOperation({ summary: 'Search listings' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async search(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.listingsService.search(query, page, pageSize);
  }

  /**
   * Get user's listings
   */
  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my listings' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async getUserListings(
    @CurrentUser() userId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.listingsService.findByUser(userId, page, pageSize);
  }

  /**
   * Get user's listings by ID
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get listings by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async getUserListingsById(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.listingsService.findByUser(userId, page, pageSize);
  }

  /**
   * Get listing details with recent reviews and rating summary
   */
  @Get(':id/details')
  @ApiOperation({ summary: 'Get listing details with reviews' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiResponse({
    status: 200,
    description: 'Listing details found',
    type: ListingDetailsDto,
  })
  async findDetails(@Param('id') id: string): Promise<ListingDetailsDto> {
    return this.listingsService.findDetails(id);
  }

  /**
   * Get listing by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get listing by ID' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiResponse({
    status: 200,
    description: 'Listing found',
    type: ListingDto,
  })
  async findOne(@Param('id') id: string): Promise<ListingDto> {
    return this.listingsService.findOne(id);
  }

  /**
   * Update listing
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update listing' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiResponse({
    status: 200,
    description: 'Listing updated successfully',
    type: ListingDto,
  })
  async update(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body() updateListingDto: UpdateListingDto,
  ): Promise<ListingDto> {
    return this.listingsService.update(id, userId, updateListingDto);
  }

  /**
   * Set listing status
   */
  @Put(':id/status/:status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set listing status' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiParam({ name: 'status', description: 'Status (active, sold, expired, suspended, draft)' })
  @ApiResponse({
    status: 200,
    description: 'Listing status updated',
    type: ListingDto,
  })
  async setStatus(
    @Param('id') id: string,
    @Param('status') status: string,
    @CurrentUser() userId: string,
  ): Promise<ListingDto> {
    return this.listingsService.setStatus(
      id,
      userId,
      status as 'active' | 'sold' | 'expired' | 'suspended' | 'draft',
    );
  }

  /**
   * Add image to listing
   */
  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add image to listing' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiResponse({
    status: 201,
    description: 'Image added successfully',
    type: ListingDto,
  })
  async addImage(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body() addImageDto: AddListingImageDto,
  ): Promise<ListingDto> {
    return this.listingsService.addImage(id, userId, addImageDto);
  }

  /**
   * Remove image from listing
   */
  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove image from listing' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiResponse({
    status: 200,
    description: 'Image removed successfully',
    type: ListingDto,
  })
  async removeImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
    @CurrentUser() userId: string,
  ): Promise<ListingDto> {
    return this.listingsService.removeImage(id, imageId, userId);
  }

  /**
   * Promote listing
   */
  @Post(':id/promote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Promote listing' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiResponse({
    status: 200,
    description: 'Listing promoted successfully',
    type: ListingDto,
  })
  async promote(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body() promoteDto: PromoteListingDto,
  ): Promise<ListingDto> {
    return this.listingsService.promote(id, userId, promoteDto);
  }

  /**
   * Delete listing
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete listing' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiResponse({
    status: 200,
    description: 'Listing deleted successfully',
  })
  async delete(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<{ message: string }> {
    return this.listingsService.delete(id, userId);
  }
}
