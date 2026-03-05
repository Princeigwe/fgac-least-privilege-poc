import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ){}

  async createSuperAdmin(
    name: string, 
    email: string,
    password: string,
    isActive: boolean,
  ){
    const user = this.usersRepository.create({
      name,
      email,
      password,
      isActive,
      isSuperAdmin: true,
    })
    return await this.usersRepository.save(user)
  }

  async createTenantUser(){}


  async getUserByEmail(email: string){
    return await this.usersRepository.findOne({
      where: {
        email
      }
    })
  }
}
