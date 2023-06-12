import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import { BusinessException } from '../exception.filter';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  const prismaService = {
    user: {
      findUnique: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
    },
  };
  const mockUser: User = {
    id: 1,
    email: 'email@email.com',
    password: 'email',
    firstName: 'Admin',
    lastName: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should create new simple user', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);
    jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(mockUser);

    const newUser = await usersService.createSimpleUser(mockUser);

    expect(prismaService.user.create.mock.calls[0][0].data.role).toBe(
      Role.USER,
    );
    expect(newUser).toStrictEqual(mockUser);
  });

  it('should create new creator', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);
    jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(mockUser);

    const newUser = await usersService.createCreator(mockUser);
    expect(prismaService.user.create.mock.calls[0][0].data.role).toBe(
      Role.CREATOR,
    );
    expect(newUser).toStrictEqual(mockUser);
  });

  it('should create new admin', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);
    jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(mockUser);

    const newUser = await usersService.createAdmin(mockUser);

    expect(prismaService.user.create.mock.calls[0][0].data.role).toBe(
      Role.ADMIN,
    );
    expect(newUser).toStrictEqual(mockUser);
  });

  it('should throw an error if user already exists', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValueOnce(mockUser);

    expect(
      async () =>
        await usersService.createSimpleUser(mockUser as CreateUserDto),
    ).rejects.toThrow(BusinessException);
  });

  it('should update user', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValueOnce(mockUser);
    jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce(mockUser);

    const dto: UpdateUserDto = { firstName: 'alex', lastName: '42' };
    const updatedUser = await usersService.updateUser(1, dto);

    expect(prismaService.user.update.mock.calls[0][0].data).toMatchObject(dto);
    expect(updatedUser).toStrictEqual(mockUser);
  });

  it('should throw an error when updating if user doesnt exist exists', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);

    expect(
      async () => await usersService.updateUser(1, {} as any),
    ).rejects.toThrow(BusinessException);
  });

  it('should find user by email', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValueOnce(mockUser);

    expect(await usersService.findByEmail('email')).toStrictEqual(mockUser);
  });
});
