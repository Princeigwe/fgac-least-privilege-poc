import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { User } from '../users/user.entity'

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ){}


  async getPermissionsOverview(){
    const permissionsOverview = [
      `${User.name}:create`,
      `${User.name}:read`,
      `${User.name}:update`,
      `${User.name}:delete`,
      // `${Permission.name}:create`,
      // `${Permission.name}:read`,
      // `${Permission.name}:update`,
      // `${Permission.name}:delete`,
    ]
    return permissionsOverview
  }
}
