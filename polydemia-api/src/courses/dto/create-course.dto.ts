import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'The name of the course',
    nullable: false,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the course',
    nullable: false,
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The price of the course',
    nullable: false,
  })
  @IsPositive()
  price: number;
}
