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
import { AuthService } from './auth.service';
import { CheckPolicies } from './policy.decorator';
import { PolicyGuard } from './policy.guard';
import { Public } from './public.decorator';
import { Role } from './role.enum';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Get('admin')
  @Roles(Role.admin)
  @UseGuards(PolicyGuard)
  @CheckPolicies((ability) => ability.can('read', 'User'))
  getProfileAdmin(@Request() req: any) {
    return req.user;
  }
}
