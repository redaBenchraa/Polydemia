import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Course } from '@prisma/client';
import { Cache } from 'cache-manager';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
@ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
@Controller('courses')
export class CoursesController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly coursesService: CoursesService,
  ) {}

  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('take') take?: number,
  ): Promise<Course[]> {
    await this.cacheManager.set('2', { key: 32 });
    const cachedItem = await this.cacheManager.get('2');
    console.log({ cachedItem });
    return this.coursesService.findAll({
      where: {
        Name: { contains: name },
      },
      take: take ? +take : undefined,
    });
  }

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}
