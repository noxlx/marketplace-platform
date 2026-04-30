import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Listing } from '../listings/entities/listing.entity';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { ListingImage } from '../listings/entities/listing-image.entity';
import { ListingAttribute } from '../listings/entities/listing-attribute.entity';
import { SearchService } from './services/search.service';
import { SearchController } from './controllers/search.controller';
import { ElasticsearchService } from '../../config/elasticsearch.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, Category, User, ListingImage, ListingAttribute]),
    ConfigModule,
  ],
  controllers: [SearchController],
  providers: [SearchService, ElasticsearchService],
  exports: [SearchService],
})
export class SearchModule implements OnModuleInit {
  constructor(
    private searchService: SearchService,
    private elasticsearchService: ElasticsearchService,
  ) {}

  /**
   * Initialize search module on startup
   */
  async onModuleInit() {
    try {
      // Create index if it doesn't exist
      await this.elasticsearchService.createListingsIndex();

      // Index all listings
      const result = await this.searchService.indexAllListings();
      console.log(`Search module initialized: ${result.indexed} listings indexed`);
    } catch (error) {
      console.error('Failed to initialize search module:', error);
      // Don't throw - allow app to start even if search isn't ready
    }
  }
}
