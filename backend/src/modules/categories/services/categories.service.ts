import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Category } from '../entities/category.entity';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryDto,
} from '../dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  /**
   * Create a new category
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    // Check if category with same slug already exists
    const existing = await this.categoriesRepository.findOne({
      where: { slug: createCategoryDto.slug },
    });

    if (existing) {
      throw new BadRequestException(`Category with slug '${createCategoryDto.slug}' already exists`);
    }

    const category = this.categoriesRepository.create(createCategoryDto);
    const saved = await this.categoriesRepository.save(category);
    return this.toDto(saved);
  }

  /**
   * Get all categories with pagination
   */
  async findAll(
    page: number = 1,
    pageSize: number = 20,
    onlyActive: boolean = true,
  ): Promise<{
    data: CategoryDto[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * pageSize;

    const whereCondition = onlyActive ? { isActive: true } : {};

    const [categories, total] = await this.categoriesRepository.findAndCount({
      where: whereCondition,
      order: { sortOrder: 'ASC', name: 'ASC' },
      skip,
      take: pageSize,
    });

    return {
      data: categories.map((cat) => this.toDto(cat)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Get a single category by ID
   */
  async findOne(id: string): Promise<CategoryDto> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with id '${id}' not found`);
    }

    return this.toDto(category);
  }

  /**
   * Get a category by slug
   */
  async findBySlug(slug: string): Promise<CategoryDto> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }

    return this.toDto(category);
  }

  /**
   * Search categories by name
   */
  async search(query: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;

    const [categories, total] = await this.categoriesRepository.findAndCount({
      where: { name: ILike(`%${query}%`), isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
      skip,
      take: pageSize,
    });

    return {
      data: categories.map((cat) => this.toDto(cat)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Update a category
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDto> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with id '${id}' not found`);
    }

    // Check if new slug conflicts with existing
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existing = await this.categoriesRepository.findOne({
        where: { slug: updateCategoryDto.slug },
      });
      if (existing) {
        throw new BadRequestException(`Category with slug '${updateCategoryDto.slug}' already exists`);
      }
    }

    Object.assign(category, updateCategoryDto);
    const updated = await this.categoriesRepository.save(category);
    return this.toDto(updated);
  }

  /**
   * Delete a category
   */
  async delete(id: string): Promise<{ message: string }> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with id '${id}' not found`);
    }

    // Check if category has any listings
    const listingsCount = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoin('category.listings', 'listings')
      .where('category.id = :id', { id })
      .getCount();

    if (listingsCount > 0) {
      throw new BadRequestException(
        `Cannot delete category with active listings. Please delete or move ${listingsCount} listing(s) first.`,
      );
    }

    await this.categoriesRepository.remove(category);
    return { message: `Category '${category.name}' deleted successfully` };
  }

  /**
   * Toggle category active status
   */
  async toggleActive(id: string): Promise<CategoryDto> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with id '${id}' not found`);
    }

    category.isActive = !category.isActive;
    const updated = await this.categoriesRepository.save(category);
    return this.toDto(updated);
  }

  /**
   * Convert entity to DTO
   */
  private toDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      imageUrl: category.imageUrl,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
