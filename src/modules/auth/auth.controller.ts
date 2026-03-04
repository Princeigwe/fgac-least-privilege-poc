import { Controller, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create.user.dto';

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
}
