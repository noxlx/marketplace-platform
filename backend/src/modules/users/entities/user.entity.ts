import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Conversation } from '../../chat/entities/conversation.entity';
import { ChatMessage } from '../../chat/entities/chat-message.entity';
import { Report } from '../../reports/entities/report.entity';
import { AdminLog } from '../../admin/entities/admin-log.entity';

@Entity('users')
@Index(['phoneNumber'], { unique: true })
@Index(['email'], { unique: true, where: 'email IS NOT NULL' })
@Index(['createdAt'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email?: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'text', nullable: true })
  profileImage: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', length: 20, default: 'inactive' })
  status: 'active' | 'inactive' | 'suspended' | 'banned';

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role: 'user' | 'admin';

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  completedTransactions: number;

  @Column({ type: 'int', default: 0 })
  totalReviews: number;

  @Column({ type: 'varchar', length: 6, nullable: true })
  otpCode: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiry: Date;

  @Column({ type: 'int', default: 0 })
  otpAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lastOtpSentAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken: string;

  @Column({ type: 'timestamp', nullable: true })
  refreshTokenExpiry: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  deviceToken: string;

  @Column({ type: 'json', nullable: true })
  preferences: {
    language?: 'ar' | 'ku' | 'en';
    darkMode?: boolean;
    notifications?: boolean;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  // Relations
  @OneToMany('Listing', 'user')
  listings: any[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Review, (review) => review.reviewer)
  reviewsGiven: Review[];

  @OneToMany(() => Review, (review) => review.reviewedUser)
  reviewsReceived: Review[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Conversation, (conversation) => conversation.buyer)
  conversationsAsBuyer: Conversation[];

  @OneToMany(() => Conversation, (conversation) => conversation.seller)
  conversationsAsSeller: Conversation[];

  @OneToMany(() => ChatMessage, (message) => message.sender)
  chatMessages: ChatMessage[];

  @OneToMany(() => Report, (report) => report.reporter)
  reportsMade: Report[];

  @OneToMany(() => Report, (report) => report.reportedUser)
  reportsReceived: Report[];

  @OneToMany(() => AdminLog, (log) => log.admin)
  adminLogs: AdminLog[];
}
