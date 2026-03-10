import { Controller, Body, Post, UseGuards, Get } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dtos/create.tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { FineGrainedPermissionGuard } from '../auth/guards/fine.grained.permission.guard';
import { RequirePermission } from '../auth/decorators/require.permission.decorator';
import { Tenant } from './tenant.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Tenants')
@ApiBearerAuth()
@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService
  ){}


  @ApiOperation({description: "This endpoint creates a tenant together with a tenant admin. This operation can only be carried out by the super-admin. This gives the tenant admin access to all existing resources"})
  @ApiBody({type: CreateTenantDto})
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

  @ApiOperation({description: "This operation gets all registered tenants on the API. Can only be executed by the super-admin."})
  @UseGuards(JwtAuthGuard, FineGrainedPermissionGuard)
  @RequirePermission(Tenant.name, 'read')
  @Get()
  async getTenants(){
    return await this.tenantsService.getTenants()
  }
}
