import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '@prisma/client';
import { BusinessException } from '../exception.filter';
import { PrismaService } from '../prisma.service';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  const prismaService = {
    category: {
      findUnique: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
    },
  };
  const mockCategory: Category = {
    id: 1,
    name: 'name',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new category', async () => {
    jest
      .spyOn(prismaService.category, 'findUnique')
      .mockResolvedValueOnce(null);
    jest
      .spyOn(prismaService.category, 'create')
      .mockResolvedValueOnce(mockCategory);

    const newcategory = await service.create(mockCategory);

    expect(prismaService.category.create.mock.calls[0][0].data).toMatchObject({
      name: mockCategory.name,
    });
    expect(newcategory).toStrictEqual(mockCategory);
  });

  it('should throw an error if category already exists', async () => {
    jest
      .spyOn(prismaService.category, 'findUnique')
      .mockResolvedValueOnce(mockCategory);

    expect(async () => await service.create(mockCategory)).rejects.toThrow(
      BusinessException,
    );
  });

  it('should update category', async () => {
    jest
      .spyOn(prismaService.category, 'findUnique')
      .mockResolvedValueOnce(mockCategory);
    jest
      .spyOn(prismaService.category, 'update')
      .mockResolvedValueOnce(mockCategory);

    const dto: UpdateCategoryDto = { name: 'name' };
    const updatedcategory = await service.update(1, dto);

    expect(prismaService.category.update.mock.calls[0][0].data).toMatchObject(
      dto,
    );
    expect(updatedcategory).toStrictEqual(mockCategory);
  });

  it('should throw an error when updating if category doesnt exist exists', async () => {
    jest
      .spyOn(prismaService.category, 'findUnique')
      .mockResolvedValueOnce(null);

    expect(async () => await service.update(1, {} as any)).rejects.toThrow(
      BusinessException,
    );
  });

  it('should find category by name', async () => {
    jest
      .spyOn(prismaService.category, 'findUnique')
      .mockResolvedValueOnce(mockCategory);

    expect(await service.findByName('name')).toStrictEqual(mockCategory);
  });

  it('should find category by id', async () => {
    jest
      .spyOn(prismaService.category, 'findUnique')
      .mockResolvedValueOnce(mockCategory);

    expect(await service.findOne(1)).toStrictEqual(mockCategory);
  });

  it('should find all categories', async () => {
    jest
      .spyOn(prismaService.category, 'findMany')
      .mockResolvedValueOnce([mockCategory]);

    expect(await service.findAll()).toStrictEqual([mockCategory]);
  });
});
