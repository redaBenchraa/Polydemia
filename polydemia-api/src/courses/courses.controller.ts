import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';
import { Course, Role } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { CheckPolicies } from '../auth/policy.decorator';
import { PolicyGuard } from '../auth/policy.guard';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
@UseGuards(AuthGuard, PolicyGuard, RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('take') take?: number,
  ): Promise<Course[]> {
    return this.coursesService.findAll({
      where: {
        name: { contains: name },
      },
      take: take ? +take : undefined,
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.CREATOR, Role.ADMIN)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.CREATOR, Role.ADMIN)
  @CheckPolicies((ability) => ability.can('update', 'Course'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }
}
