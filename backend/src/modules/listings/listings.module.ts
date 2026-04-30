import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { ListingImage } from './entities/listing-image.entity';
import { ListingAttribute } from './entities/listing-attribute.entity';
import { Category } from '../categories/entities/category.entity';
import { ListingsService } from './services/listings.service';
import { ListingsController } from './controllers/listings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, ListingImage, ListingAttribute, Category])],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
