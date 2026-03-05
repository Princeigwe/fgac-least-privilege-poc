import { Controller, Post, Body, UseGuards, Request, Response} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create.user.dto';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}


  @Post('register/super-admin')
  async registerSuperAdmin(@Body() body: CreateUserDto){
    return await this.authService.registerSuperAdmin(
      body.name,
      body.email,
      body.password,
      body.isActive,
    )
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Body()body: LoginDto) {
    return await this.authService.login(body.email, body.password)
  }
}
