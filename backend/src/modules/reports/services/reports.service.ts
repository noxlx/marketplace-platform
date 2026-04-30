import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from '../entities/report.entity';
import { User } from '../../users/entities/user.entity';
import { Listing } from '../../listings/entities/listing.entity';
import { AdminService } from '../../admin/services/admin.service';
import {
  CreateReportDto,
  ReportDto,
  ReportsResponseDto,
  UpdateReportStatusDto,
} from '../dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    private adminService: AdminService,
  ) {}

  async create(reporterId: string, dto: CreateReportDto): Promise<ReportDto> {
    if (!dto.reportedId && !dto.listingId) {
      throw new BadRequestException('Report must target a user, a listing, or both');
    }

    if (dto.reportedId === reporterId) {
      throw new BadRequestException('You cannot report yourself');
    }

    if (dto.reportedId) {
      const reportedUser = await this.usersRepository.findOne({ where: { id: dto.reportedId } });
      if (!reportedUser) {
        throw new NotFoundException(`User with id '${dto.reportedId}' not found`);
      }
    }

    if (dto.listingId) {
      const listing = await this.listingsRepository.findOne({ where: { id: dto.listingId } });
      if (!listing) {
        throw new NotFoundException(`Listing with id '${dto.listingId}' not found`);
      }
    }

    const report = await this.reportsRepository.save({
      reporterId,
      reportedId: dto.reportedId,
      listingId: dto.listingId,
      reason: dto.reason,
      description: dto.description,
      status: 'pending',
    });

    return this.mapReport(report);
  }

  async findMine(
    reporterId: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<ReportsResponseDto> {
    return this.findByStatus(page, pageSize, undefined, reporterId);
  }

  async findAll(
    page: number = 1,
    pageSize: number = 20,
    status?: ReportStatus,
  ): Promise<ReportsResponseDto> {
    return this.findByStatus(page, pageSize, status);
  }

  async updateStatus(
    adminId: string,
    reportId: string,
    dto: UpdateReportStatusDto,
  ): Promise<ReportDto> {
    const report = await this.reportsRepository.findOne({ where: { id: reportId } });
    if (!report) {
      throw new NotFoundException(`Report with id '${reportId}' not found`);
    }

    const previousStatus = report.status;
    report.status = dto.status;
    const saved = await this.reportsRepository.save(report);
    await this.adminService.log(adminId, 'update_report_status', 'report', reportId, {
      previousStatus,
      status: dto.status,
    });

    return this.mapReport(saved);
  }

  private async findByStatus(
    page: number,
    pageSize: number,
    status?: ReportStatus,
    reporterId?: string,
  ): Promise<ReportsResponseDto> {
    const skip = (page - 1) * pageSize;
    const where: any = {};
    if (status) where.status = status;
    if (reporterId) where.reporterId = reporterId;

    const [reports, total] = await this.reportsRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return {
      data: reports.map((report) => this.mapReport(report)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  private mapReport(report: Report): ReportDto {
    return {
      id: report.id,
      reporterId: report.reporterId,
      reportedId: report.reportedId,
      listingId: report.listingId,
      reason: report.reason,
      description: report.description,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    };
  }
}
