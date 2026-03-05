import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Permission } from '../permissions/permission.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ){}


  async registerSuperAdmin(
    name: string, 
    email: string,
    password: string,
    isActive: boolean,
  ){
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    password = hashedPassword

    return await this.usersService.createSuperAdmin(
      name,
      email,
      password,
      isActive,
    )
  }

  async getValidatedUser(email: string, inputtedPassword: string) {
    const user = await this.usersService.getUserByEmail(email)
    let hashedPassword = user.password
    const validPassword = await bcrypt.compare(inputtedPassword, hashedPassword)
    if (!validPassword) {
      throw new HttpException("Invalid Credentials", HttpStatus.BAD_REQUEST)
    }
    return user
  }


  async generateJwtAccessToken(
    userId: string, 
    email: string, 
    isSuperAdmin: boolean,
    isTenantAdmin: boolean,
    permission: Permission
  ){
    const payload = { userId, email, isSuperAdmin, isTenantAdmin, permission}
    const token = this.jwtService.sign(payload) 
    return token
  }


  async login(email: string, password: string){
    email = email.toLowerCase()
    const user = await this.getValidatedUser(email, password)
    if(!user){
      throw new HttpException("Invalid Credentials", HttpStatus.BAD_REQUEST)
    }
    const token = await this.generateJwtAccessToken(
      user.id, 
      user.email,
      user.isSuperAdmin,
      user.isTenantAdmin,
      user.permission
    )
    return {
      token: token,
      user: user
    }
  }
}
