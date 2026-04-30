import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // ========================================================================
  // CORS Configuration
  // ========================================================================
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:8080',
      process.env.WEB_URL || 'http://localhost:3001',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ========================================================================
  // Security Middleware
  // ========================================================================
  app.use(helmet());
  app.use(compression());

  // ========================================================================
  // Global Pipes & Filters
  // ========================================================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // ========================================================================
  // API Versioning
  // ========================================================================
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
  });

  // ========================================================================
  // Swagger Documentation
  // ========================================================================
  const config = new DocumentBuilder()
    .setTitle('Iraqi Marketplace API')
    .setDescription(
      'Production-ready classified marketplace API for Iraq - similar to Sahibinden, Dubizzle, OLX',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('Authentication', 'User authentication & authorization')
    .addTag('Users', 'User profile management')
    .addTag('Listings', 'Create, view, edit, delete listings')
    .addTag('Search', 'Search & filter listings')
    .addTag('Chat', 'Real-time messaging')
    .addTag('Notifications', 'Push notifications & in-app notifications')
    .addTag('Favorites', 'Save & manage favorite listings')
    .addTag('Admin', 'Admin management & moderation')
    .addTag('Reports', 'Report abuse & spam')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: 2,
    },
  });

  // ========================================================================
  // Start Server
  // ========================================================================
  const port = process.env.APP_PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(
    `✅ Application is running on: http://localhost:${port}/api/v1`,
  );
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start application:', err);
  process.exit(1);
});
