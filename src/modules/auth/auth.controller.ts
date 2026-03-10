import { Controller, Post, Body, UseGuards, Request, Response, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create.user.dto';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}


  @ApiOperation({description: "This endpoint registers a super admin user"})
  @ApiBody({type: CreateUserDto})
  // @UseGuards(JwtAuthGuard)
  @Post('register/super-admin')
  async registerSuperAdmin(@Body() body: CreateUserDto){
    return await this.authService.registerSuperAdmin(
      body.name,
      body.email,
      body.password,
      body.isActive,
    )
  }

  @ApiProperty({description: "This endpoint registers an admin user"})
  @ApiBody({type: LoginDto})
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Body()body: LoginDto) {
    return await this.authService.login(body.email, body.password)
  }


  @ApiOperation({description: "This gets the profile of the currently logged in user"})
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user
  }
}
