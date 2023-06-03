import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/role.enum';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 0,
      email: 'admin@email.com',
      password: 'changeme',
      role: Role.admin,
      fistName: 'Admin',
      lastName: 'Admin',
      banned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 1,
      email: 'alex@email.com',
      password: 'changeme',
      role: Role.user,
      fistName: 'Alex',
      lastName: 'Alex',
      banned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);
    if (user) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return user;
  }
}