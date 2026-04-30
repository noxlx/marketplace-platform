import { Controller, Get, Post, Delete, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { FavoritesService } from '../services/favorites.service';
import { FavoriteDto, FavoritesResponseDto, FavoriteStatusDto } from '../dto/favorite.dto';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my favorite listings' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, type: FavoritesResponseDto })
  async findMine(
    @CurrentUser() userId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ): Promise<FavoritesResponseDto> {
    return this.favoritesService.findMine(userId, page, pageSize);
  }

  @Get(':listingId/status')
  @ApiOperation({ summary: 'Check whether a listing is in my favorites' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  @ApiResponse({ status: 200, type: FavoriteStatusDto })
  async status(
    @CurrentUser() userId: string,
    @Param('listingId') listingId: string,
  ): Promise<FavoriteStatusDto> {
    return this.favoritesService.status(userId, listingId);
  }

  @Post(':listingId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a listing to my favorites' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  @ApiResponse({ status: 201, type: FavoriteDto })
  async add(
    @CurrentUser() userId: string,
    @Param('listingId') listingId: string,
  ): Promise<FavoriteDto> {
    return this.favoritesService.add(userId, listingId);
  }

  @Delete(':listingId')
  @ApiOperation({ summary: 'Remove a listing from my favorites' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  async remove(
    @CurrentUser() userId: string,
    @Param('listingId') listingId: string,
  ): Promise<{ message: string }> {
    return this.favoritesService.remove(userId, listingId);
  }
}
