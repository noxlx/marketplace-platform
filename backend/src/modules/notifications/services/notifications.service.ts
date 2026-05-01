import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { User } from '../../users/entities/user.entity';
import {
  CreateNotificationDto,
  NotificationDto,
  NotificationPreferencesDto,
  NotificationsResponseDto,
  UnreadCountDto,
} from '../dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateNotificationDto): Promise<NotificationDto> {
    const notification = await this.notificationsRepository.save(dto);
    return this.mapNotification(notification);
  }

  async findMine(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
    unreadOnly: boolean = false,
  ): Promise<NotificationsResponseDto> {
    const skip = (page - 1) * pageSize;
    const where = unreadOnly ? { userId, isRead: false } : { userId };
    const [notifications, total] = await this.notificationsRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return {
      data: notifications.map((notification) => this.mapNotification(notification)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async unreadCount(userId: string): Promise<UnreadCountDto> {
    const unreadCount = await this.notificationsRepository.count({
      where: { userId, isRead: false },
    });

    return { unreadCount };
  }

  async markRead(userId: string, notificationId: string): Promise<NotificationDto> {
    const notification = await this.notificationsRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with id '${notificationId}' not found`);
    }

    notification.isRead = true;
    notification.readAt = new Date();
    const saved = await this.notificationsRepository.save(notification);
    return this.mapNotification(saved);
  }

  async markAllRead(userId: string): Promise<{ updated: number }> {
    const result = await this.notificationsRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );

    return { updated: result.affected || 0 };
  }

  async getPreferences(userId: string): Promise<NotificationPreferencesDto> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id '${userId}' not found`);
    }

    return {
      language: user.preferences?.language || 'en',
      notifications: user.preferences?.notifications ?? true,
      emailNotifications: user.preferences?.emailNotifications ?? false,
      smsNotifications: user.preferences?.smsNotifications ?? true,
    };
  }

  async updatePreferences(
    userId: string,
    dto: NotificationPreferencesDto,
  ): Promise<NotificationPreferencesDto> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id '${userId}' not found`);
    }

    user.preferences = {
      ...(user.preferences || {}),
      ...dto,
    };
    await this.usersRepository.save(user);

    return this.getPreferences(userId);
  }

  private mapNotification(notification: Notification): NotificationDto {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      relatedId: notification.relatedId,
      isRead: notification.isRead,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    };
  }
}
