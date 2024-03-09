import { createMock } from '@golevelup/ts-jest';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { Course } from '@prisma/client';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;
  const mockCourse = {
    id: 1,
    name: 'Course 1',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Course;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [CoursesService],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({})
      .useMocker(createMock)
      .compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all courses', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValueOnce([mockCourse]);
    expect(await controller.findAll()).toStrictEqual([mockCourse]);
  });
});
