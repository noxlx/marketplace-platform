import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AdminGuard } from '../../admin/guards/admin.guard';
import { ReportsService } from '../services/reports.service';
import {
  CreateReportDto,
  ReportDto,
  ReportsResponseDto,
  UpdateReportStatusDto,
} from '../dto/report.dto';
import { ReportStatus } from '../entities/report.entity';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('api/v1/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create an abuse or spam report' })
  @ApiResponse({ status: 201, type: ReportDto })
  async create(
    @CurrentUser() reporterId: string,
    @Body() dto: CreateReportDto,
  ): Promise<ReportDto> {
    return this.reportsService.create(reporterId, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my submitted reports' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, type: ReportsResponseDto })
  async findMine(
    @CurrentUser() reporterId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ): Promise<ReportsResponseDto> {
    return this.reportsService.findMine(reporterId, page, pageSize);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Admin: list reports' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, type: ReportsResponseDto })
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Query('status') status?: ReportStatus,
  ): Promise<ReportsResponseDto> {
    return this.reportsService.findAll(page, pageSize, status);
  }

  @Put('admin/:reportId/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Admin: update report status' })
  @ApiParam({ name: 'reportId', description: 'Report ID' })
  @ApiResponse({ status: 200, type: ReportDto })
  async updateStatus(
    @CurrentUser() adminId: string,
    @Param('reportId') reportId: string,
    @Body() dto: UpdateReportStatusDto,
  ): Promise<ReportDto> {
    return this.reportsService.updateStatus(adminId, reportId, dto);
  }
}
