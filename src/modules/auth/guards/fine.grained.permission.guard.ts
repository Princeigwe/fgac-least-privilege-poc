import {
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  UnauthorizedException,
  ForbiddenException
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../permissions/permission.entity';
import { PERMISSION_KEY } from '../decorators/require.permission.decorator';


export class FineGrainedPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}


  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest()
    const user = request.user

    // firstly verify that the user is authenticated
    if (!user) throw new UnauthorizedException('User not authenticated')

    // super-admin bypasses all checks
    if (user.isSuperAdmin) return true

    // getting the permission attributes from the @RequiredPermission decorator
    const required = this.reflector.getAllAndOverride<{ resource: string; action: string }>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    )

    // if none, allow access
    if (!required) return true;

    const { resource, action } = required

    // building the scope from the attributes
    const requiredScope = `${resource}:${action}`

    const tenantID = request.params?.tenantID ?? request.body?.tenantID

    if(tenantID){
      const userPermission = await this.permissionRepo.findOne({
        where: { 
          user: { id: user.id },
          tenantId: tenantID
        },
      })

      if (!userPermission) {
        throw new ForbiddenException('No permissions found for this user');
      }

      const hasScope = userPermission.scopes.includes(requiredScope);

      if (!hasScope) {
        throw new ForbiddenException(
          `Missing required permission: [${requiredScope}]`
        );
      }

      return true
    }

    // invalid  super-admin operation or tenant id not included in request 
    throw new ForbiddenException('Invalid permission access')
  }
}