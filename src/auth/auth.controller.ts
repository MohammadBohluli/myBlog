import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { User } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { CurrentUser } from './types/current-user.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@User() user: CurrentUser) {
    const { accessToken, refreshToken } = await this.authService.login(user);

    return { accessToken, refreshToken, userId: user.userId };
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signout(@User() user: CurrentUser) {
    await this.authService.signout(user.userId);
    return { message: 'you are sign out successfuly' };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@User() user: CurrentUser) {
    const { accessToken, refreshToken } =
      await this.authService.refreshToken(user);

    return { accessToken, refreshToken };
  }
}
