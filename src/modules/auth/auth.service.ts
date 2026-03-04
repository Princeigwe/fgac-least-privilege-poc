import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService
  ){}


  async registerSuperAdmin(
    name: string, 
    email: string,
    password: string,
    isActive: boolean,
  ){
    return await this.usersService.createSuperAdmin(
      name,
      email,
      password,
      isActive,
    )
  }
}
