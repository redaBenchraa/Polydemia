import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ nullable: false })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ nullable: false })
  @IsNotEmpty()
  lastName: string;
}
