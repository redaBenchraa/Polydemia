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
import { AuthService } from './auth.service';
import { SighInDto } from './dto/sign-in-dto';
import { CheckPolicies } from './policy.decorator';
import { Public } from './public.decorator';
import { Role } from './role.enum';
import { Roles } from './roles.decorator';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SighInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password²);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Get('admin')
  @Roles(Role.admin)
  @UseGuards()
  @CheckPolicies((ability) => ability.can('read', 'User'))
  getProfileAdmin(@Request() req: any) {
    return req.user;
  }
}
