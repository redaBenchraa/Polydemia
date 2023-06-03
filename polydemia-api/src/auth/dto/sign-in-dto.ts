import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SighInDto {
  @ApiProperty({
    example: 'admin@email.com',
    description: 'Email',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: 'changeme',
    description: 'Password',
  })
  @IsNotEmpty()
  password: string;
}
