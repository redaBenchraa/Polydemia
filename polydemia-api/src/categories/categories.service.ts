import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { BusinessException, ErrorDomain } from '../exception.filter';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async create(category: CreateCategoryDto): Promise<Category> {
    const existing = await this.findByName(category.name);
    if (existing !== null) {
      throw new BusinessException(
        ErrorDomain.categories,
        'Category already exists',
        'Category already exists',
        400,
      );
    }
    return this.prismaService.category.create({
      data: {
        name: category.name,
      },
    });
  }

  async update(id: number, category: UpdateCategoryDto): Promise<Category> {
    const existing = await this.prismaService.category.findUnique({
      where: { id },
    });
    if (existing === null) {
      throw new BusinessException(
        ErrorDomain.users,
        'User does not exist',
        'User does not exist',
        404,
      );
    }
    return this.prismaService.category.update({
      where: { id },
      data: {
        name: category.name,
      },
    });
  }

  async findAll(): Promise<Category[]> {
    return this.prismaService.category.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.category.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return await this.prismaService.category.findUnique({
      where: { name },
    });
  }
}
