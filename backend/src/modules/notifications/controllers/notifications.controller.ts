import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { NotificationsService } from '../services/notifications.service';
import {
  NotificationDto,
  NotificationsResponseDto,
  UnreadCountDto,
} from '../dto/notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my notifications' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: NotificationsResponseDto })
  async findMine(
    @CurrentUser() userId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Query('unreadOnly') unreadOnly: boolean = false,
  ): Promise<NotificationsResponseDto> {
    return this.notificationsService.findMine(userId, page, pageSize, unreadOnly);
  }

  @Get('me/unread-count')
  @ApiOperation({ summary: 'Get my unread notification count' })
  @ApiResponse({ status: 200, type: UnreadCountDto })
  async unreadCount(@CurrentUser() userId: string): Promise<UnreadCountDto> {
    return this.notificationsService.unreadCount(userId);
  }

  @Put('me/read-all')
  @ApiOperation({ summary: 'Mark all my notifications as read' })
  async markAllRead(@CurrentUser() userId: string): Promise<{ updated: number }> {
    return this.notificationsService.markAllRead(userId);
  }

  @Put(':notificationId/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiParam({ name: 'notificationId', description: 'Notification ID' })
  @ApiResponse({ status: 200, type: NotificationDto })
  async markRead(
    @CurrentUser() userId: string,
    @Param('notificationId') notificationId: string,
  ): Promise<NotificationDto> {
    return this.notificationsService.markRead(userId, notificationId);
  }
}
