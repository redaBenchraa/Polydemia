import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    description: 'The name of the course',
    nullable: false,
  })
  name?: string;

  @ApiProperty({})
  age?: number;
}
