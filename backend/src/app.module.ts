import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmAsyncConfig } from './config/database.config';
import { cacheAsyncConfig } from './config/cache.config';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // ====================================================================
    // CONFIGURATION
    // ====================================================================
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
      cacheTTL: 60,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
