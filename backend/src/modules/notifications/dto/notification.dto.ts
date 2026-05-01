import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'message' })
  @IsNotEmpty()
  @IsString()
  type: NotificationType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  relatedId?: string;
}

export class NotificationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  type: NotificationType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  relatedId?: string;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty({ required: false })
  readAt?: Date;

  @ApiProperty()
  createdAt: Date;
}

export class NotificationsResponseDto {
  @ApiProperty({ isArray: true, type: NotificationDto })
  data: NotificationDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}

export class UnreadCountDto {
  @ApiProperty()
  unreadCount: number;
}

export class NotificationPreferencesDto {
  @ApiProperty({ enum: ['ar', 'ku', 'en'], required: false })
  @IsOptional()
  @IsIn(['ar', 'ku', 'en'])
  language?: 'ar' | 'ku' | 'en';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  notifications?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;
}
