import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between, MoreThan, LessThan } from 'typeorm';
import { Listing, ListingStatus } from '../entities/listing.entity';
import { ListingImage } from '../entities/listing-image.entity';
import { ListingAttribute } from '../entities/listing-attribute.entity';
import { Category } from '../../categories/entities/category.entity';
import {
  CreateListingDto,
  UpdateListingDto,
  ListingDto,
  ListingFiltersDto,
  AddListingImageDto,
  PromoteListingDto,
} from '../dto/listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    @InjectRepository(ListingImage)
    private listingImagesRepository: Repository<ListingImage>,
    @InjectRepository(ListingAttribute)
    private listingAttributesRepository: Repository<ListingAttribute>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  /**
   * Create a new listing
   */
  async create(userId: string, createListingDto: CreateListingDto): Promise<ListingDto> {
    const { images, attributes, ...listingInput } = createListingDto;

    // Verify category exists
    const category = await this.categoriesRepository.findOne({
      where: { id: listingInput.categoryId },
    });

    if (!category) {
      throw new BadRequestException(`Category with id '${listingInput.categoryId}' not found`);
    }

    // Create listing
    const listing = this.listingsRepository.create({
      ...listingInput,
      userId,
      status: listingInput.status || 'active',
    });

    const savedListing = await this.listingsRepository.save(listing);

    // Add images if provided
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await this.listingImagesRepository.save({
          listingId: savedListing.id,
          imageUrl: images[i],
          sortOrder: i,
          isPrimary: i === 0,
        });
      }
    }

    // Add attributes if provided
    if (attributes) {
      for (const [name, value] of Object.entries(attributes)) {
        await this.listingAttributesRepository.save({
          listingId: savedListing.id,
          attributeName: name,
          attributeValue: value,
        });
      }
    }

    return this.findOne(savedListing.id);
  }

  /**
   * Get all listings with filters and pagination
   */
  async findAll(
    page: number = 1,
    pageSize: number = 20,
    filters?: ListingFiltersDto,
  ): Promise<{
    data: ListingDto[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * pageSize;
    const query = this.listingsRepository.createQueryBuilder('listing');

    // Build WHERE clause
    query.where('listing.status = :status', { status: 'active' });

    if (filters?.categoryId) {
      query.andWhere('listing.categoryId = :categoryId', { categoryId: filters.categoryId });
    }

    if (filters?.city) {
      query.andWhere('listing.city = :city', { city: filters.city });
    }

    if (filters?.minPrice) {
      query.andWhere('listing.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters?.maxPrice) {
      query.andWhere('listing.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters?.search) {
      query.andWhere(
        'listing.title ILIKE :search OR listing.description ILIKE :search',
        { search: `%${filters.search}%` },
      );
    }

    // Sorting
    const sortBy = filters?.sortBy || 'createdAt';
    const sortOrder = (filters?.sortOrder || 'DESC').toUpperCase() as 'ASC' | 'DESC';
    query.orderBy(`listing.${sortBy}`, sortOrder);

    query.skip(skip).take(pageSize);

    const [listings, total] = await query.getManyAndCount();

    return {
      data: await Promise.all(listings.map((l) => this.enrichListing(l))),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Get a single listing by ID
   */
  async findOne(id: string): Promise<ListingDto> {
    const listing = await this.listingsRepository.findOne({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException(`Listing with id '${id}' not found`);
    }

    // Increment views
    listing.views += 1;
    await this.listingsRepository.save(listing);

    return this.enrichListing(listing);
  }

  /**
   * Get user's listings
   */
  async findByUser(userId: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;

    const [listings, total] = await this.listingsRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return {
      data: await Promise.all(listings.map((l) => this.enrichListing(l))),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Search listings
   */
  async search(query: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;

    const [listings, total] = await this.listingsRepository.findAndCount({
      where: [
        { title: ILike(`%${query}%`), status: 'active' },
        { description: ILike(`%${query}%`), status: 'active' },
      ],
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });

    return {
      data: await Promise.all(listings.map((l) => this.enrichListing(l))),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Update a listing
   */
  async update(
    id: string,
    userId: string,
    updateListingDto: UpdateListingDto,
  ): Promise<ListingDto> {
    const listing = await this.listingsRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException(`Listing with id '${id}' not found`);
    }

    // Check ownership
    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    // Verify category if being changed
    if (updateListingDto.categoryId && updateListingDto.categoryId !== listing.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateListingDto.categoryId },
      });
      if (!category) {
        throw new BadRequestException(`Category with id '${updateListingDto.categoryId}' not found`);
      }
    }

    Object.assign(listing, updateListingDto);
    await this.listingsRepository.save(listing);

    return this.findOne(id);
  }

  /**
   * Delete a listing
   */
  async delete(id: string, userId: string): Promise<{ message: string }> {
    const listing = await this.listingsRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException(`Listing with id '${id}' not found`);
    }

    // Check ownership
    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await this.listingsRepository.remove(listing);
    return { message: `Listing '${listing.title}' deleted successfully` };
  }

  /**
   * Add image to listing
   */
  async addImage(id: string, userId: string, addImageDto: AddListingImageDto): Promise<ListingDto> {
    const listing = await this.listingsRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException(`Listing with id '${id}' not found`);
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only modify your own listings');
    }

    // If this is primary, unset other primary images
    if (addImageDto.isPrimary) {
      await this.listingImagesRepository.update(
        { listingId: id, isPrimary: true },
        { isPrimary: false },
      );
    }

    await this.listingImagesRepository.save({
      listingId: id,
      imageUrl: addImageDto.imageUrl,
      thumbnailUrl: addImageDto.thumbnailUrl,
      sortOrder: addImageDto.sortOrder || 0,
      isPrimary: addImageDto.isPrimary || false,
    });

    return this.findOne(id);
  }

  /**
   * Remove image from listing
   */
  async removeImage(listingId: string, imageId: string, userId: string): Promise<ListingDto> {
    const listing = await this.listingsRepository.findOne({ where: { id: listingId } });

    if (!listing) {
      throw new NotFoundException(`Listing with id '${listingId}' not found`);
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only modify your own listings');
    }

    const image = await this.listingImagesRepository.findOne({
      where: { id: imageId, listingId },
    });

    if (!image) {
      throw new NotFoundException(`Image not found`);
    }

    await this.listingImagesRepository.remove(image);

    // If this was primary, make the first remaining image primary
    if (image.isPrimary) {
      const remainingImages = await this.listingImagesRepository.find({
        where: { listingId },
        order: { sortOrder: 'ASC' },
      });

      if (remainingImages.length > 0) {
        remainingImages[0].isPrimary = true;
        await this.listingImagesRepository.save(remainingImages[0]);
      }
    }

    return this.findOne(listingId);
  }

  /**
   * Set listing status (sold, expired, etc.)
   */
  async setStatus(id: string, userId: string, status: ListingStatus): Promise<ListingDto> {
    const listing = await this.listingsRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException(`Listing with id '${id}' not found`);
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    listing.status = status;
    await this.listingsRepository.save(listing);

    return this.findOne(id);
  }

  /**
   * Promote a listing
   */
  async promote(id: string, userId: string, promoteDto: PromoteListingDto): Promise<ListingDto> {
    const listing = await this.listingsRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException(`Listing with id '${id}' not found`);
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only promote your own listings');
    }

    if (promoteDto.type === 'active') {
      listing.isPromoted = false;
      listing.promotedUntil = null;
    } else if (promoteDto.type === 'top') {
      listing.isTop = true;
      listing.promotedUntil = promoteDto.promotedUntil ? new Date(promoteDto.promotedUntil) : null;
    } else if (promoteDto.type === 'featured') {
      listing.isFeatured = true;
      listing.promotedUntil = promoteDto.promotedUntil ? new Date(promoteDto.promotedUntil) : null;
    }

    await this.listingsRepository.save(listing);
    return this.findOne(id);
  }

  /**
   * Get featured listings
   */
  async getFeatured(limit: number = 12): Promise<ListingDto[]> {
    const listings = await this.listingsRepository.find({
      where: { isFeatured: true, status: 'active' },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return Promise.all(listings.map((l) => this.enrichListing(l)));
  }

  /**
   * Enrich listing with relations
   */
  private async enrichListing(listing: Listing): Promise<ListingDto> {
    const images = await this.listingImagesRepository.find({
      where: { listingId: listing.id },
      order: { sortOrder: 'ASC' },
    });

    const attributes = await this.listingAttributesRepository.find({
      where: { listingId: listing.id },
    });

    return {
      id: listing.id,
      userId: listing.userId,
      categoryId: listing.categoryId,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      city: listing.city,
      location: listing.location,
      status: listing.status,
      views: listing.views,
      favoritesCount: listing.favoritesCount,
      isFeatured: listing.isFeatured,
      isTop: listing.isTop,
      isPromoted: listing.isPromoted,
      promotedUntil: listing.promotedUntil,
      images: images.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        thumbnailUrl: img.thumbnailUrl,
        sortOrder: img.sortOrder,
        isPrimary: img.isPrimary,
        createdAt: img.createdAt,
      })),
      attributes: attributes.map((attr) => ({
        id: attr.id,
        attributeName: attr.attributeName,
        attributeValue: attr.attributeValue,
        createdAt: attr.createdAt,
        updatedAt: attr.updatedAt,
      })),
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      expiresAt: listing.expiresAt,
    };
  }
}
