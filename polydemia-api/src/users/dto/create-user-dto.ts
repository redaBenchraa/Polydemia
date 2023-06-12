import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ nullable: false })
  @IsEmail()
  email: string;

  @ApiProperty({ nullable: false })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ nullable: false })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ nullable: false })
  @IsStrongPassword()
  password: string;
}
