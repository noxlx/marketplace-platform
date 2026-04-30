import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AdminGuard } from '../guards/admin.guard';
import { AdminService } from '../services/admin.service';
import {
  AdminLogsResponseDto,
  AdminStatsDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
} from '../dto/admin.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('api/v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard stats' })
  @ApiResponse({ status: 200, type: AdminStatsDto })
  async stats(): Promise<AdminStatsDto> {
    return this.adminService.stats();
  }

  @Get('users')
  @ApiOperation({ summary: 'List users for moderation' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async listUsers(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.adminService.listUsers(page, pageSize);
  }

  @Put('users/:userId/status')
  @ApiOperation({ summary: 'Update user account status' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async updateUserStatus(
    @CurrentUser() adminId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(adminId, userId, dto);
  }

  @Put('users/:userId/role')
  @ApiOperation({ summary: 'Update user role' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async updateUserRole(
    @CurrentUser() adminId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.adminService.updateUserRole(adminId, userId, dto);
  }

  @Put('listings/:listingId/suspend')
  @ApiOperation({ summary: 'Suspend a listing' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  async suspendListing(
    @CurrentUser() adminId: string,
    @Param('listingId') listingId: string,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.suspendListing(adminId, listingId, reason);
  }

  @Get('logs')
  @ApiOperation({ summary: 'List admin audit logs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, type: AdminLogsResponseDto })
  async listLogs(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ): Promise<AdminLogsResponseDto> {
    return this.adminService.listLogs(page, pageSize);
  }
}
