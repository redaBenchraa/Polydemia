import { createMock } from '@golevelup/ts-jest';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '@prisma/client';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoryController', () => {
  let controller: CategoriesController;
  let categoriesService: CategoriesController;
  const mockCategory: Category = {
    id: 1,
    name: 'name',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({})
      .useMocker(createMock)
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all categories', async () => {
    jest
      .spyOn(categoriesService, 'findAll')
      .mockResolvedValueOnce([mockCategory]);
    expect(await controller.findAll()).toStrictEqual([mockCategory]);
  });

  it('should create a category', async () => {
    jest.spyOn(categoriesService, 'create').mockResolvedValueOnce(mockCategory);
    expect(await controller.create(mockCategory)).toStrictEqual(mockCategory);
  });

  it('should update a category', async () => {
    jest.spyOn(categoriesService, 'update').mockResolvedValueOnce(mockCategory);
    expect(await controller.update('1', mockCategory)).toStrictEqual(
      mockCategory,
    );
  });
});
