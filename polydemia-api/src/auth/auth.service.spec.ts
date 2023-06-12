import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthService],
      providers: [UsersService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const user: User = {
    id: 0,
    email: 'email',
    password: bcrypt.hashSync('password', 10),
    role: Role.ADMIN,
    firstName: 'Admin',
    lastName: 'Admin',
    banned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('Sign in', () => {
    it('should return an authenticated user', async () => {
      const result = { access_token: 'token' };
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('token');
      expect(await service.signIn('email', 'password')).toStrictEqual(result);
    });

    it('should throw an error if the user is not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);
      expect(
        async () => await service.signIn('email', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if password is not correct', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);
      expect(
        async () => await service.signIn('email', 'wrong'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
