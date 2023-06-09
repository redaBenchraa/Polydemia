import { createMock } from '@golevelup/ts-jest';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;
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
    const result = [
      {
        id: 2,
        Name: 'Course 2',
        Description: 'Course 2 Description',
        ImageUrl: 'Course 2 ImageUrl',
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ] as any;
    jest.spyOn(service, 'findAll').mockResolvedValueOnce(result);
    expect(await controller.findAll()).toStrictEqual(result);
  });
});
