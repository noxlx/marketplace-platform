import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity';

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
    entities: [User],
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
