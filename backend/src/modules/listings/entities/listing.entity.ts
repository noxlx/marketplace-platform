import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { ListingImage } from './listing-image.entity';
import { ListingAttribute } from './listing-attribute.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Conversation } from '../../chat/entities/conversation.entity';
import { Report } from '../../reports/entities/report.entity';

export type ListingStatus = 'active' | 'sold' | 'expired' | 'suspended' | 'draft';

@Entity('listings')
@Index(['userId'])
@Index(['categoryId'])
@Index(['status'])
@Index(['city'])
@Index(['createdAt'])
@Index(['isFeatured'])
@Index(['title', 'description'], { fulltext: true })
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'active',
  })
  status: ListingStatus;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ type: 'int', default: 0 })
  favoritesCount: number;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'boolean', default: false })
  isTop: boolean;

  @Column({ type: 'boolean', default: false })
  isPromoted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  promotedUntil: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP + INTERVAL '30 days'" })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.listings, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.listings, { eager: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ListingImage, (image) => image.listing, { eager: false })
  images: ListingImage[];

  @OneToMany(() => ListingAttribute, (attribute) => attribute.listing, { eager: false })
  attributes: ListingAttribute[];

  @OneToMany(() => Favorite, (favorite) => favorite.listing, { eager: false })
  favorites: Favorite[];

  @OneToMany(() => Review, (review) => review.listing, { eager: false })
  reviews: Review[];

  @OneToMany(() => Conversation, (conversation) => conversation.listing, { eager: false })
  conversations: Conversation[];

  @OneToMany(() => Report, (report) => report.listing, { eager: false })
  reports: Report[];
}
