import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ReportStatus } from '../entities/report.entity';

export class CreateReportDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  reportedId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  listingId?: string;

  @ApiProperty({ example: 'spam' })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({ example: 'This listing looks suspicious.' })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description: string;
}

export class UpdateReportStatusDto {
  @ApiProperty({ enum: ['pending', 'investigating', 'resolved', 'dismissed'] })
  @IsEnum(['pending', 'investigating', 'resolved', 'dismissed'])
  status: ReportStatus;
}

export class ReportDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reporterId: string;

  @ApiProperty({ required: false })
  reportedId?: string;

  @ApiProperty({ required: false })
  listingId?: string;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: ReportStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ReportsResponseDto {
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
