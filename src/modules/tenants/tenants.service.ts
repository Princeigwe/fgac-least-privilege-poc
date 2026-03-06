import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { UsersService } from '../users/users.service';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    private usersService: UsersService,
    private permissionsService: PermissionsService
  ){}


  // one tenant-admin user is needed to create a tenant
  async createTenant(
    tenantName: string, 
    tenantAdminName: string, 
    tenantAdminEmail: string, 
    isTenantAdmin=true
  ){
    const tenantAdmin = await this.usersService.createTenantUser(
      tenantAdminName, 
      tenantAdminEmail, 
      isTenantAdmin
    )

    let tenant = this.tenantRepo.create({
      name: tenantName,
      users: [tenantAdmin]
    })

    tenant = await this.tenantRepo.save(tenant)
    let allResourceActions = await this.permissionsService.getPermissionsOverview()

    //  removing the ability to create a tenant. only meant for super admin users
    const filteredPermissions = allResourceActions.filter(scope => !scope.startsWith('Tenant'));

    const permission = await this.permissionsService.assignNewUserPermission(
      tenantAdmin,
      tenant.id,
      filteredPermissions
    )

    return {
      tenant,
      permission
    }
  }
}
