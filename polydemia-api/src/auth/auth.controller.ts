import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SighInDto } from './dto/sign-in-dto';
import { CheckPolicies } from './policy.decorator';
import { PolicyGuard } from './policy.guard';
import { Public } from './public.decorator';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard, PolicyGuard, RolesGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SighInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Roles(Role.ADMIN)
  @CheckPolicies((ability) => ability.can('read', 'User'))
  @Get('admin')
  getProfileAdmin(@Request() req: any) {
    return req.user;
  }
}
