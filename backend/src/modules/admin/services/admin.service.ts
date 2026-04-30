import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Listing } from '../../listings/entities/listing.entity';
import { Report } from '../../reports/entities/report.entity';
import { Conversation } from '../../chat/entities/conversation.entity';
import { AdminLog } from '../entities/admin-log.entity';
import {
  AdminLogDto,
  AdminLogsResponseDto,
  AdminStatsDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
} from '../dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    @InjectRepository(AdminLog)
    private adminLogsRepository: Repository<AdminLog>,
  ) {}

  async stats(): Promise<AdminStatsDto> {
    const [users, activeUsers, listings, activeListings, pendingReports, conversations] =
      await Promise.all([
        this.usersRepository.count(),
        this.usersRepository.count({ where: { status: 'active' } }),
        this.listingsRepository.count(),
        this.listingsRepository.count({ where: { status: 'active' } }),
        this.reportsRepository.count({ where: { status: 'pending' } }),
        this.conversationsRepository.count(),
      ]);

    return { users, activeUsers, listings, activeListings, pendingReports, conversations };
  }

  async listUsers(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await this.usersRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async updateUserStatus(
    adminId: string,
    userId: string,
    dto: UpdateUserStatusDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id '${userId}' not found`);
    }

    const previousStatus = user.status;
    user.status = dto.status;
    const saved = await this.usersRepository.save(user);
    await this.log(adminId, 'update_user_status', 'user', userId, {
      previousStatus,
      status: dto.status,
      reason: dto.reason,
    });

    return saved;
  }

  async updateUserRole(adminId: string, userId: string, dto: UpdateUserRoleDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id '${userId}' not found`);
    }

    const previousRole = user.role;
    user.role = dto.role;
    const saved = await this.usersRepository.save(user);
    await this.log(adminId, 'update_user_role', 'user', userId, {
      previousRole,
      role: dto.role,
    });

    return saved;
  }

  async suspendListing(
    adminId: string,
    listingId: string,
    reason?: string,
  ): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException(`Listing with id '${listingId}' not found`);
    }

    const previousStatus = listing.status;
    listing.status = 'suspended';
    const saved = await this.listingsRepository.save(listing);
    await this.log(adminId, 'suspend_listing', 'listing', listingId, {
      previousStatus,
      reason,
    });

    return saved;
  }

  async listLogs(page: number = 1, pageSize: number = 20): Promise<AdminLogsResponseDto> {
    const skip = (page - 1) * pageSize;
    const [logs, total] = await this.adminLogsRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return {
      data: logs.map((log) => this.mapLog(log)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async log(
    adminId: string,
    action: string,
    targetType: string,
    targetId?: string,
    details?: Record<string, any>,
  ): Promise<AdminLogDto> {
    const log = await this.adminLogsRepository.save({
      adminId,
      action,
      targetType,
      targetId,
      details,
    });

    return this.mapLog(log);
  }

  private mapLog(log: AdminLog): AdminLogDto {
    return {
      id: log.id,
      adminId: log.adminId,
      action: log.action,
      targetType: log.targetType,
      targetId: log.targetId,
      details: log.details,
      createdAt: log.createdAt,
    };
  }
}
