import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportDto } from '../../reports/dto/report.dto';

export class AdminStatsDto {
  @ApiProperty()
  users: number;

  @ApiProperty()
  activeUsers: number;

  @ApiProperty()
  listings: number;

  @ApiProperty()
  activeListings: number;

  @ApiProperty()
  pendingReports: number;

  @ApiProperty()
  conversations: number;
}

export class UpdateUserStatusDto {
  @ApiProperty({ enum: ['active', 'inactive', 'suspended', 'banned'] })
  @IsEnum(['active', 'inactive', 'suspended', 'banned'])
  status: 'active' | 'inactive' | 'suspended' | 'banned';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateUserRoleDto {
  @ApiProperty({ enum: ['user', 'admin'] })
  @IsEnum(['user', 'admin'])
  role: 'user' | 'admin';
}

export class AdminLogDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  adminId: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  targetType: string;

  @ApiProperty({ required: false })
  targetId?: string;

  @ApiProperty({ required: false })
  details?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;
}

export class AdminLogsResponseDto {
  @ApiProperty({ isArray: true, type: AdminLogDto })
  data: AdminLogDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}

export class AdminReportsResponseDto {
  @ApiProperty({ isArray: true, type: ReportDto })
  data: ReportDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}

export class UpdateAdminReportStatusDto {
  @ApiProperty({ enum: ['pending', 'investigating', 'resolved', 'dismissed'] })
  @IsEnum(['pending', 'investigating', 'resolved', 'dismissed'])
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
}
