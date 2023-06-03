import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { CaslModule } from 'src/auth/casl/casl.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { PolicyGuard } from './policy.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    UsersModule,
    CaslModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60h' },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PolicyGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}