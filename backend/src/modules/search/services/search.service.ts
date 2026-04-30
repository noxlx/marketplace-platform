import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../../listings/entities/listing.entity';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { ListingImage } from '../../listings/entities/listing-image.entity';
import { ListingAttribute } from '../../listings/entities/listing-attribute.entity';
import { ElasticsearchService } from '../../../config/elasticsearch.config';
import {
  SearchQueryDto,
  SearchResponseDto,
  SearchResultItemDto,
  AutocompleteResponseDto,
  PopularSearchesResponseDto,
  SearchFacetsDto,
  FacetDto,
} from '../dto/search.dto';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private popularSearches: Map<string, number> = new Map();

  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ListingImage)
    private listingImagesRepository: Repository<ListingImage>,
    @InjectRepository(ListingAttribute)
    private listingAttributesRepository: Repository<ListingAttribute>,
    private elasticsearchService: ElasticsearchService,
  ) {
    this.initializePopularSearches();
  }

  /**
   * Initialize popular searches from cache or database
   */
  private initializePopularSearches(): void {
    // In production, this would load from Redis cache
    this.popularSearches.clear();
  }

  /**
   * Index all listings in Elasticsearch
   */
  async indexAllListings(): Promise<{ indexed: number; failed: number }> {
    this.logger.log('Starting full index of all listings...');

    try {
      // Clear existing index
      await this.elasticsearchService.clearListingsIndex();

      // Fetch all active listings
      const listings = await this.listingsRepository.find({
        where: { status: 'active' },
      });

      this.logger.log(`Found ${listings.length} listings to index`);

      // Enrich listings with related data
      const enrichedListings = await Promise.all(
        listings.map((listing) => this.enrichListingForIndex(listing)),
      );

      // Bulk index
      if (enrichedListings.length > 0) {
        await this.elasticsearchService.bulkIndexListings(enrichedListings);
      }

      this.logger.log(`Successfully indexed ${enrichedListings.length} listings`);
      return { indexed: enrichedListings.length, failed: 0 };
    } catch (error) {
      this.logger.error('Failed to index listings:', error);
      return { indexed: 0, failed: 1 };
    }
  }

  /**
   * Enrich listing with related data for indexing
   */
  private async enrichListingForIndex(listing: Listing): Promise<any> {
    const [category, user, images, attributes] = await Promise.all([
      this.categoriesRepository.findOne({ where: { id: listing.categoryId } }),
      this.usersRepository.findOne({ where: { id: listing.userId } }),
      this.listingImagesRepository.find({
        where: { listingId: listing.id },
        order: { sortOrder: 'ASC' },
      }),
      this.listingAttributesRepository.find({
        where: { listingId: listing.id },
      }),
    ]);

    const primaryImage = images.find((img) => img.isPrimary) || images[0];

    return {
      id: listing.id,
      userId: listing.userId,
      categoryId: listing.categoryId,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      city: listing.city,
      location: listing.location,
      status: listing.status,
      views: listing.views,
      favoritesCount: listing.favoritesCount,
      isFeatured: listing.isFeatured,
      isTop: listing.isTop,
      isPromoted: listing.isPromoted,
      promotedUntil: listing.promotedUntil,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      expiresAt: listing.expiresAt,
      categoryName: category?.name || '',
      userName: user ? `${user.firstName} ${user.lastName}` : '',
      userRating: user?.rating || 0,
      images: images.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        isPrimary: img.isPrimary,
      })),
      attributes: attributes.map((attr) => ({
        attributeName: attr.attributeName,
        attributeValue: attr.attributeValue,
      })),
    };
  }

  /**
   * Search listings with Elasticsearch
   */
  async search(query: SearchQueryDto): Promise<SearchResponseDto> {
    const startTime = Date.now();
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const from = (page - 1) * pageSize;

    try {
      // Track popular search
      if (query.q) {
        this.trackSearch(query.q);
      }

      // Build Elasticsearch query
      const esQuery = this.buildElasticsearchQuery(query);

      // Get client and execute search
      const client = this.elasticsearchService.getClient();
      const response = await client.search({
        index: 'listings',
        from,
        size: pageSize,
        body: esQuery,
      });
      const total = this.getSearchTotal(response.hits.total);

      // Process results
      const results = await Promise.all(
        response.hits.hits.map(async (hit: any) => this.formatSearchResult(hit)),
      );

      // Get facets if requested
      let facets: SearchFacetsDto | undefined;
      if (query.includeFacets && response.aggregations) {
        facets = this.formatFacets(response.aggregations);
      }

      const executionTime = Date.now() - startTime;

      return {
        results,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        query: query.q || '',
        executionTime,
        facets,
      };
    } catch (error) {
      this.logger.error('Search failed:', error);
      // Fallback to database search
      return this.fallbackSearch(query);
    }
  }

  /**
   * Build Elasticsearch query
   */
  private buildElasticsearchQuery(query: SearchQueryDto): any {
    const must: any[] = [];
    const filter: any[] = [];

    // Status filter (always active)
    filter.push({ term: { status: 'active' } });

    // Text search
    if (query.q) {
      must.push({
        multi_match: {
          query: query.q,
          fields: [
            'title^3',
            'description^2',
            'title.arabic^2',
            'description.arabic',
            'categoryName',
          ],
          fuzziness: 'AUTO',
        },
      });
    }

    // Category filter
    if (query.category) {
      filter.push({
        bool: {
          should: [{ term: { categoryId: query.category } }, { term: { 'categoryName.keyword': query.category } }],
        },
      });
    }

    // City filter
    if (query.city) {
      filter.push({ term: { 'city.keyword': query.city } });
    }

    // Price range filter
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceRange: any = {};
      if (query.minPrice !== undefined) priceRange.gte = query.minPrice;
      if (query.maxPrice !== undefined) priceRange.lte = query.maxPrice;
      filter.push({ range: { price: priceRange } });
    }

    // Build sort
    const sort = this.buildSort(query);

    // Build aggregations
    const aggs = query.includeFacets ? this.buildAggregations() : undefined;

    return {
      query: {
        bool: {
          must: must.length > 0 ? must : [{ match_all: {} }],
          filter,
        },
      },
      sort,
      aggs,
      highlight: {
        fields: {
          title: {},
          description: {},
        },
      },
    };
  }

  private getSearchTotal(total: any): number {
    if (typeof total === 'number') {
      return total;
    }

    return total?.value || 0;
  }

  /**
   * Build sort clause
   */
  private buildSort(query: SearchQueryDto): any[] {
    const sortBy = query.sortBy || 'relevance';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    if (sortBy === 'relevance') {
      return [{ _score: { order: 'desc' } }];
    }

    if (sortBy === 'createdAt') {
      return [{ createdAt: { order: sortOrder } }];
    }

    if (sortBy === 'price') {
      return [{ price: { order: sortOrder } }];
    }

    if (sortBy === 'views') {
      return [{ views: { order: sortOrder } }];
    }

    return [{ _score: { order: 'desc' } }];
  }

  /**
   * Build aggregations for facets
   */
  private buildAggregations(): any {
    return {
      categories: {
        terms: {
          field: 'categoryName.keyword',
          size: 20,
        },
      },
      cities: {
        terms: {
          field: 'city.keyword',
          size: 20,
        },
      },
      price_range: {
        stats: {
          field: 'price',
        },
      },
    };
  }

  /**
   * Format search result from Elasticsearch
   */
  private async formatSearchResult(hit: any): Promise<SearchResultItemDto> {
    const source = hit._source;

    return {
      id: source.id,
      title: source.title,
      description: source.description,
      price: source.price,
      city: source.city,
      location: source.location,
      status: source.status,
      categoryId: source.categoryId,
      categoryName: source.categoryName,
      userId: source.userId,
      userName: source.userName,
      userRating: source.userRating,
      isFeatured: source.isFeatured,
      isTop: source.isTop,
      views: source.views,
      favoritesCount: source.favoritesCount,
      createdAt: new Date(source.createdAt),
      primaryImage: source.images?.[0]?.imageUrl,
      score: hit._score,
    };
  }

  /**
   * Format facets/aggregations
   */
  private formatFacets(aggs: any): SearchFacetsDto {
    const categories: FacetDto[] = (aggs.categories?.buckets || []).map((bucket: any) => ({
      name: bucket.key,
      count: bucket.doc_count,
    }));

    const cities: FacetDto[] = (aggs.cities?.buckets || []).map((bucket: any) => ({
      name: bucket.key,
      count: bucket.doc_count,
    }));

    const priceStats = aggs.price_range;

    return {
      categories,
      cities,
      priceRange: {
        min: priceStats?.min || 0,
        max: priceStats?.max || 0,
      },
    };
  }

  /**
   * Fallback to database search if Elasticsearch fails
   */
  private async fallbackSearch(query: SearchQueryDto) {
    this.logger.warn('Falling back to database search');

    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    let qb = this.listingsRepository.createQueryBuilder('listing').where('listing.status = :status', {
      status: 'active',
    });

    if (query.q) {
      qb = qb.andWhere('(listing.title ILIKE :q OR listing.description ILIKE :q)', {
        q: `%${query.q}%`,
      });
    }

    if (query.category) {
      qb = qb.andWhere('listing.categoryId = :categoryId', { categoryId: query.category });
    }

    if (query.city) {
      qb = qb.andWhere('listing.city = :city', { city: query.city });
    }

    if (query.minPrice) {
      qb = qb.andWhere('listing.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (query.maxPrice) {
      qb = qb.andWhere('listing.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 'ASC' : 'DESC';

    qb = qb.orderBy(`listing.${sortBy}`, sortOrder).skip(skip).take(pageSize);

    const [results, total] = await qb.getManyAndCount();

    const formattedResults = await Promise.all(
      results.map(async (listing) => {
        const [category, user, images] = await Promise.all([
          this.categoriesRepository.findOne({ where: { id: listing.categoryId } }),
          this.usersRepository.findOne({ where: { id: listing.userId } }),
          this.listingImagesRepository.find({
            where: { listingId: listing.id },
            order: { sortOrder: 'ASC' },
          }),
        ]);

        return {
          id: listing.id,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          city: listing.city,
          location: listing.location,
          status: listing.status,
          categoryId: listing.categoryId,
          categoryName: category?.name || '',
          userId: listing.userId,
          userName: user ? `${user.firstName} ${user.lastName}` : '',
          userRating: user?.rating || 0,
          isFeatured: listing.isFeatured,
          isTop: listing.isTop,
          views: listing.views,
          favoritesCount: listing.favoritesCount,
          createdAt: listing.createdAt,
          primaryImage: images[0]?.imageUrl,
        };
      }),
    );

    return {
      results: formattedResults,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      query: query.q || '',
      executionTime: 0,
    };
  }

  /**
   * Get autocomplete suggestions
   */
  async getAutocomplete(query: string, limit: number = 10): Promise<AutocompleteResponseDto> {
    if (!query || query.length < 2) {
      return { suggestions: [] };
    }

    try {
      const client = this.elasticsearchService.getClient();

      const response = await client.search({
        index: 'listings',
        body: {
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query: query,
                    fields: ['title', 'categoryName'],
                    fuzziness: 'AUTO',
                  },
                },
              ],
              filter: [{ term: { status: 'active' } }],
            },
          },
          aggs: {
            titles: {
              terms: {
                field: 'title.keyword',
                size: limit,
              },
            },
            categories: {
              terms: {
                field: 'categoryName.keyword',
                size: limit,
              },
            },
          },
          size: 0,
        },
      });

      const aggregations = response.aggregations as any;
      const suggestions = [
        ...(aggregations?.titles?.buckets || []).map((bucket: any) => ({
          text: bucket.key,
          count: bucket.doc_count,
          type: 'title' as const,
        })),
        ...(aggregations?.categories?.buckets || []).map((bucket: any) => ({
          text: bucket.key,
          count: bucket.doc_count,
          type: 'category' as const,
        })),
      ]
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return { suggestions };
    } catch (error) {
      this.logger.error('Autocomplete failed:', error);
      return { suggestions: [] };
    }
  }

  /**
   * Get popular searches
   */
  async getPopularSearches(limit: number = 10): Promise<PopularSearchesResponseDto> {
    const searches = Array.from(this.popularSearches.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return { searches };
  }

  /**
   * Track search query for popularity
   */
  private trackSearch(query: string): void {
    const normalized = query.toLowerCase().trim();
    if (normalized.length > 0) {
      const count = this.popularSearches.get(normalized) || 0;
      this.popularSearches.set(normalized, count + 1);
    }
  }

  /**
   * When a listing is created/updated, index it
   */
  async indexListing(listing: Listing): Promise<void> {
    try {
      const enriched = await this.enrichListingForIndex(listing);
      await this.elasticsearchService.indexListing(enriched);
      this.logger.log(`Indexed listing ${listing.id}`);
    } catch (error) {
      this.logger.error(`Failed to index listing ${listing.id}:`, error);
    }
  }

  /**
   * When a listing is deleted, remove it from index
   */
  async deleteListing(listingId: string): Promise<void> {
    try {
      await this.elasticsearchService.deleteListing(listingId);
      this.logger.log(`Deleted listing ${listingId} from index`);
    } catch (error) {
      this.logger.error(`Failed to delete listing ${listingId} from index:`, error);
    }
  }

  /**
   * Check Elasticsearch health
   */
  async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    const healthy = await this.elasticsearchService.isHealthy();
    return {
      healthy,
      message: healthy ? 'Elasticsearch is healthy' : 'Elasticsearch is unhealthy',
    };
  }
}
