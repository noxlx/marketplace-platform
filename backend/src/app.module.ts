import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmAsyncConfig } from './config/database.config';
import { cacheAsyncConfig } from './config/cache.config';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ListingsModule } from './modules/listings/listings.module';
import { SearchModule } from './modules/search/search.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ChatModule } from './modules/chat/chat.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    // ====================================================================
    // CONFIGURATION
    // ====================================================================
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),

    // ====================================================================
    // DATABASE
    // ====================================================================
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),

    // ====================================================================
    // CACHE (REDIS)
    // ====================================================================
    CacheModule.registerAsync(cacheAsyncConfig),

    // ====================================================================
    // APPLICATION MODULES
    // ====================================================================
    UsersModule,
    CategoriesModule,
    ListingsModule,
    SearchModule,
    FavoritesModule,
    ReviewsModule,
    NotificationsModule,
    ChatModule,
    ReportsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
