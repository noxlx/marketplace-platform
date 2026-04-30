import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { Listing } from '../modules/listings/entities/listing.entity';
import { ListingImage } from '../modules/listings/entities/listing-image.entity';
import { ListingAttribute } from '../modules/listings/entities/listing-attribute.entity';
import { Favorite } from '../modules/favorites/entities/favorite.entity';
import { Review } from '../modules/reviews/entities/review.entity';
import { Notification } from '../modules/notifications/entities/notification.entity';
import { Conversation } from '../modules/chat/entities/conversation.entity';
import { ChatMessage } from '../modules/chat/entities/chat-message.entity';
import { Report } from '../modules/reports/entities/report.entity';
import { AdminLog } from '../modules/admin/entities/admin-log.entity';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST', 'localhost'),
    port: configService.get<number>('DATABASE_PORT', 5432),
    username: configService.get('DATABASE_USER', 'marketplace_user'),
    password: configService.get('DATABASE_PASSWORD', 'changeme'),
    database: configService.get('DATABASE_NAME', 'marketplace_db'),
    entities: [
      User,
      Category,
      Listing,
      ListingImage,
      ListingAttribute,
      Favorite,
      Review,
      Notification,
      Conversation,
      ChatMessage,
      Report,
      AdminLog,
    ],
    synchronize: configService.get('NODE_ENV') === 'development',
    logging: configService.get('NODE_ENV') === 'development',
    migrations: ['src/database/migrations/*.ts'],
    migrationsRun: true,
    ssl:
      configService.get('DATABASE_SSL') === 'true'
        ? { rejectUnauthorized: false }
        : false,
    retryAttempts: 5,
    retryDelay: 3000,
  }),
};
