import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import { Listing } from '../../listings/entities/listing.entity';
import { ListingsService } from '../../listings/services/listings.service';
import { FavoriteDto, FavoritesResponseDto, FavoriteStatusDto } from '../dto/favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    private listingsService: ListingsService,
  ) {}

  async add(userId: string, listingId: string): Promise<FavoriteDto> {
    const listing = await this.listingsRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException(`Listing with id '${listingId}' not found`);
    }

    const existing = await this.favoritesRepository.findOne({
      where: { userId, listingId },
    });
    if (existing) {
      throw new ConflictException('Listing is already in favorites');
    }

    const favorite = await this.favoritesRepository.save({ userId, listingId });
    listing.favoritesCount += 1;
    await this.listingsRepository.save(listing);

    return this.mapFavorite(favorite);
  }

  async remove(userId: string, listingId: string): Promise<{ message: string }> {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, listingId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoritesRepository.remove(favorite);
    await this.listingsRepository.decrement({ id: listingId }, 'favoritesCount', 1);

    return { message: 'Listing removed from favorites' };
  }

  async findMine(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<FavoritesResponseDto> {
    const skip = (page - 1) * pageSize;
    const [favorites, total] = await this.favoritesRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    const data = await Promise.all(
      favorites.map(async (favorite) => ({
        ...this.mapFavorite(favorite),
        listing: await this.listingsService.findOne(favorite.listingId),
      })),
    );

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async status(userId: string, listingId: string): Promise<FavoriteStatusDto> {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, listingId },
    });

    return {
      listingId,
      isFavorite: !!favorite,
    };
  }

  private mapFavorite(favorite: Favorite): FavoriteDto {
    return {
      id: favorite.id,
      userId: favorite.userId,
      listingId: favorite.listingId,
      createdAt: favorite.createdAt,
    };
  }
}
