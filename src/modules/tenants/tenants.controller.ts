import { Controller, Body, Post, UseGuards, Get } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dtos/create.tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { FineGrainedPermissionGuard } from '../auth/guards/fine.grained.permission.guard';
import { RequirePermission } from '../auth/decorators/require.permission.decorator';
import { Tenant } from './tenant.entity';

@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService
  ){}


  @UseGuards(JwtAuthGuard, FineGrainedPermissionGuard)
  @RequirePermission(Tenant.name, 'create')
  @Post()
  async createTenant(@Body() body: CreateTenantDto){
    return await this.tenantsService.createTenant(
      body.name,
      body.tenantAdminName,
      body.tenantAdminEmail
    )
  }

  @UseGuards(JwtAuthGuard, FineGrainedPermissionGuard)
  @RequirePermission(Tenant.name, 'read')
  @Get()
  async getTenants(){
    return await this.tenantsService.getTenants()
  }
}
