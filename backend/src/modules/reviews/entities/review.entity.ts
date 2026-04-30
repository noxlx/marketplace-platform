import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Listing } from '../../listings/entities/listing.entity';

@Entity('reviews')
@Index(['reviewerId'])
@Index(['reviewedUserId'])
@Index(['listingId'])
@Index(['reviewerId', 'listingId'], { unique: true })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  reviewerId: string;

  @Column({ type: 'uuid' })
  reviewedUserId: string;

  @Column({ type: 'uuid' })
  listingId: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reviewsGiven, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @ManyToOne(() => User, (user) => user.reviewsReceived, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reviewed_user_id' })
  reviewedUser: User;

  @ManyToOne(() => Listing, (listing) => listing.reviews, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing;
}
