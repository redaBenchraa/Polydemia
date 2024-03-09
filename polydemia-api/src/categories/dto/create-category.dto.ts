import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Software engineerig',
    description: 'Category name',
  })
  @IsNotEmpty()
  name: string;
}
