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


  async updateScopesFromScopesToRemove(currentScopes: string[], scopesToRemove: string[]){
    const scopesRemoveSet = new Set(scopesToRemove)
    return currentScopes.filter(scope => !scopesRemoveSet.has(scope))
  }


  async updateScopesFromScopesToAdd(currentScopes: string[], scopesToAdd: string[]){
    const scopesToAddSet = new Set(scopesToAdd)
    return [...new Set([...currentScopes, ...scopesToAddSet])]
  }


  async ensureNoOverlappingScopes(scopesToAdd: string[], scopesToRemove: string[]){
    const scopesToRemoveSet = new Set(scopesToRemove)
    const overlapping = scopesToAdd.filter(scope => scopesToRemoveSet.has(scope))
    if(overlapping.length > 0){
      throw new HttpException(`Scopes conflict: ${overlapping.join(", ")}`, HttpStatus.BAD_REQUEST)
    }
  }


  async updatePermission(permissionId:string, scopesToAdd?: string[],scopesToRemove?: string[]){
    if(scopesToAdd && scopesToRemove){
      await this.ensureNoOverlappingScopes(scopesToAdd, scopesToRemove)
    }

    const permission = await this.permissionRepo.findOne({where: {id: permissionId}})
    if(!permission){
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND)
    }
    const currentScopes = permission.scopes
    if(scopesToAdd){
      permission.scopes = await this.updateScopesFromScopesToAdd(currentScopes, scopesToAdd)
    }
    if(scopesToRemove){
      permission.scopes = await this.updateScopesFromScopesToRemove(currentScopes, scopesToRemove)
    }
    return await this.permissionRepo.save(permission)
  }
}
