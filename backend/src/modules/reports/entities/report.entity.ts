import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Listing } from '../../listings/entities/listing.entity';

export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

@Entity('reports')
@Index(['reporterId'])
@Index(['listingId'])
@Index(['status'])
@Index(['createdAt'])
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  reporterId: string;

  @Column({ type: 'uuid', nullable: true })
  reportedId: string;

  @Column({ type: 'uuid', nullable: true })
  listingId: string;

  @Column({ type: 'varchar', length: 100 })
  reason: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: ReportStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.reportsMade, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  @ManyToOne(() => User, (user) => user.reportsReceived, { eager: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reported_id' })
  reportedUser: User;

  @ManyToOne(() => Listing, (listing) => listing.reports, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing;
}
