import { ConfigService } from '@nestjs/config';
import { Client, ClientOptions } from '@elastic/elasticsearch';

export const createElasticsearchConfig = (configService: ConfigService): ClientOptions => {
  const node = configService.get('ELASTICSEARCH_NODE', 'http://localhost:9200');
  const username = configService.get('ELASTICSEARCH_USERNAME', 'elastic');
  const password = configService.get('ELASTICSEARCH_PASSWORD', 'changeme');

  return {
    node,
    auth: {
      username,
      password,
    },
    maxRetries: 5,
    requestTimeout: 30000,
  };
};

export class ElasticsearchService {
  private client: Client;

  constructor(private configService: ConfigService) {
    this.client = new Client(createElasticsearchConfig(configService));
  }

  /**
   * Get Elasticsearch client
   */
  getClient(): Client {
    return this.client;
  }

  /**
   * Check if Elasticsearch is healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      const health = await this.client.cluster.health();
      return health.status !== 'red';
    } catch (error) {
      console.error('Elasticsearch health check failed:', error);
      return false;
    }
  }

  /**
   * Create index for listings
   */
  async createListingsIndex(): Promise<void> {
    const indexName = 'listings';

    try {
      const exists = await this.client.indices.exists({ index: indexName });

      if (exists) {
        console.log(`Index '${indexName}' already exists`);
        return;
      }

      await this.client.indices.create({
        index: indexName,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
            analysis: {
              analyzer: {
                arabic_analyzer: {
                  type: 'standard',
                  stopwords: '_arabic_',
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              userId: { type: 'keyword' },
              categoryId: { type: 'keyword' },
              title: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                  keyword: { type: 'keyword' },
                  arabic: { type: 'text', analyzer: 'arabic_analyzer' },
                },
              },
              description: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                  arabic: { type: 'text', analyzer: 'arabic_analyzer' },
                },
              },
              price: { type: 'float' },
              city: {
                type: 'text',
                fields: { keyword: { type: 'keyword' } },
              },
              location: { type: 'text' },
              status: { type: 'keyword' },
              views: { type: 'integer' },
              favoritesCount: { type: 'integer' },
              isFeatured: { type: 'boolean' },
              isTop: { type: 'boolean' },
              isPromoted: { type: 'boolean' },
              promotedUntil: { type: 'date' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
              expiresAt: { type: 'date' },
              categoryName: { type: 'text', analyzer: 'standard' },
              userName: { type: 'text', analyzer: 'standard' },
              userRating: { type: 'float' },
              images: {
                type: 'nested',
                properties: {
                  id: { type: 'keyword' },
                  imageUrl: { type: 'keyword' },
                  isPrimary: { type: 'boolean' },
                },
              },
              attributes: {
                type: 'nested',
                properties: {
                  attributeName: { type: 'keyword' },
                  attributeValue: { type: 'text' },
                },
              },
            },
          },
        },
      });

      console.log(`Index '${indexName}' created successfully`);
    } catch (error) {
      console.error(`Failed to create index '${indexName}':`, error);
      throw error;
    }
  }

  /**
   * Index a listing document
   */
  async indexListing(listing: any): Promise<void> {
    try {
      await this.client.index({
        index: 'listings',
        id: listing.id,
        body: listing,
      });
    } catch (error) {
      console.error('Failed to index listing:', error);
      throw error;
    }
  }

  /**
   * Update a listing document
   */
  async updateListing(id: string, updates: any): Promise<void> {
    try {
      await this.client.update({
        index: 'listings',
        id,
        body: {
          doc: updates,
        },
      });
    } catch (error) {
      console.error('Failed to update listing:', error);
      throw error;
    }
  }

  /**
   * Delete a listing document
   */
  async deleteListing(id: string): Promise<void> {
    try {
      await this.client.delete({
        index: 'listings',
        id,
      });
    } catch (error) {
      console.error('Failed to delete listing:', error);
      throw error;
    }
  }

  /**
   * Bulk index listings
   */
  async bulkIndexListings(listings: any[]): Promise<void> {
    try {
      const body = listings.flatMap((doc) => [
        { index: { _index: 'listings', _id: doc.id } },
        doc,
      ]);

      await this.client.bulk({ body });
    } catch (error) {
      console.error('Failed to bulk index listings:', error);
      throw error;
    }
  }

  /**
   * Clear the listings index
   */
  async clearListingsIndex(): Promise<void> {
    try {
      await this.client.deleteByQuery({
        index: 'listings',
        body: {
          query: {
            match_all: {},
          },
        },
      });
    } catch (error) {
      console.error('Failed to clear listings index:', error);
      throw error;
    }
  }
}
