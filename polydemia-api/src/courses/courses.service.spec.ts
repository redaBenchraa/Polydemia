import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { CoursesService } from './courses.service';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  const mockPrismaService = {
    course: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    coursesService = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(coursesService).toBeDefined();
  });

  it('should return a list of courses', async () => {
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
    jest
      .spyOn(mockPrismaService.course, 'findMany')
      .mockResolvedValueOnce(result);
    expect(await coursesService.findAll({})).toStrictEqual(result);
  });
});
