import { Controller, Get, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health check endpoint
   * Returns application status
   */
  @Get('health')
  @ApiTags('System')
  @ApiOperation({
    summary: 'Health check',
    description: 'Check if the application is running and ready to serve requests.',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      example: {
        status: 'ok',
        message: 'Application is running',
        timestamp: '2026-04-30T12:00:00Z',
      },
    },
  })
  getHealth() {
    return this.appService.getHealth();
  }

  /**
   * API information endpoint
   */
  @Get('api/info')
  @ApiTags('System')
  @ApiOperation({
    summary: 'API Information',
    description: 'Get information about the API',
  })
  @ApiResponse({
    status: 200,
    description: 'API information',
    schema: {
      example: {
        name: 'Iraqi Marketplace API',
        version: '1.0.0',
        environment: 'development',
        docs: 'http://localhost:3000/api/docs',
      },
    },
  })
  getInfo() {
    return this.appService.getInfo();
  }
}
