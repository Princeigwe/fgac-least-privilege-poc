import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { User } from '../users/user.entity'
import { Tenant } from '../tenants/tenant.entity';

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
      `${Tenant.name}:create`,
      `${Tenant.name}:read`,
      `${Tenant.name}:update`,
      `${Tenant.name}:delete`
      // `${Permission.name}:create`,
      // `${Permission.name}:read`,
      // `${Permission.name}:update`,
      // `${Permission.name}:delete`,
    ]
    return permissionsOverview
  }


  async validatePermissionScopes(scopes: string[]){
    const permissionOverview = await this.getPermissionsOverview()
    for(let scope of scopes){
      if(!permissionOverview.includes(scope)){
        throw new HttpException(`Invalid permission scope: ${scope}`, HttpStatus.BAD_REQUEST)
      }
    }
  }

  async assignNewUserPermission(user: User, tenantID: string, scopes: string[]){
    await this.validatePermissionScopes(scopes)
    const permission = this.permissionRepo.create({
      user,
      tenantId: tenantID,
      scopes
    })
    return await this.permissionRepo.save(permission)
  }
}
