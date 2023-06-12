import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { BusinessException, ErrorDomain } from '../exception.filter';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async createSimpleUser(user: CreateUserDto): Promise<User | null> {
    return this.createUser(user, Role.USER);
  }

  async createCreator(user: CreateUserDto): Promise<User | null> {
    return this.createUser(user, Role.CREATOR);
  }

  async createAdmin(user: CreateUserDto): Promise<User | null> {
    return this.createUser(user, Role.ADMIN);
  }

  private async createUser(
    user: CreateUserDto,
    role: Role,
  ): Promise<User | null> {
    const existingUser = await this.findByEmail(user.email);
    if (existingUser !== null) {
      throw new BusinessException(
        ErrorDomain.users,
        'User already exists',
        'User already exists',
        400,
      );
    }
    const password = await bcrypt.hash(user.password, 10);
    return this.prismaService.user.create({
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: password,
        role: role,
      },
    });
  }

  async updateUser(id: number, user: UpdateUserDto): Promise<User | null> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (existingUser === null) {
      throw new BusinessException(
        ErrorDomain.users,
        'User does not exist',
        'User does not exist',
        404,
      );
    }
    return this.prismaService.user.update({
      where: { id },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    return user;
  }
}
