import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHealth() {
    return {
      status: 'ok',
      message: 'Application is running',
      timestamp: new Date().toISOString(),
      environment: this.configService.get('NODE_ENV', 'development'),
    };
  }

  getInfo() {
    return {
      name: 'Iraqi Marketplace API',
      version: '1.0.0',
      description:
        'Production-ready classified marketplace API for Iraq - similar to Sahibinden, Dubizzle, OLX',
      environment: this.configService.get('NODE_ENV', 'development'),
      docs: 'http://localhost:3000/api/docs',
      apiBase: 'http://localhost:3000/api/v1',
    };
  }
}
