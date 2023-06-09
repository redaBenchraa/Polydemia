import { createMock } from '@golevelup/ts-jest';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an authenticated user', async () => {
    const result = { access_token: 'token' };
    jest.spyOn(authService, 'signIn').mockResolvedValueOnce(result);
    expect(
      await controller.signIn({
        email: 'email',
        password: 'password',
      }),
    ).toStrictEqual(result);
  });

  it('should return an error', async () => {
    jest
      .spyOn(authService, 'signIn')
      .mockRejectedValueOnce(new UnauthorizedException());
    expect(
      async () =>
        await controller.signIn({
          email: 'email',
          password: 'password',
        }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
