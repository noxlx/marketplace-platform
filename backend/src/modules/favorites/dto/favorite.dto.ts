import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ListingDto } from '../../listings/dto/listing.dto';

export class AddFavoriteDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  listingId: string;
}

export class FavoriteDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  listingId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: ListingDto, required: false })
  listing?: ListingDto;
}

export class FavoritesResponseDto {
  @ApiProperty({ isArray: true, type: FavoriteDto })
  data: FavoriteDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}

export class FavoriteStatusDto {
  @ApiProperty()
  listingId: string;

  @ApiProperty()
  isFavorite: boolean;
}
