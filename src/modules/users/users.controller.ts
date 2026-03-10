import { Controller, Post, Body, Param, UseGuards, Patch, Get} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { FineGrainedPermissionGuard } from '../auth/guards/fine.grained.permission.guard';
import { RequirePermission } from '../auth/decorators/require.permission.decorator';
import { User } from './user.entity';
import { CreateTenantUserDto } from './dtos/create.tenant.user.dto';
import { UpdateUserPermissionScopesDto } from './dtos/update.user.permission.scopes.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ){}


  // async createSuperAdmin(){}
  @UseGuards(JwtAuthGuard, FineGrainedPermissionGuard)
  @RequirePermission(User.name, 'read')
  @Get(':tenantID')
  async getTenantUsers(
    @Param('tenantID') tenantId: string
  ){
    return await this.usersService.getTenantUsers(tenantId)
  }


  @UseGuards(JwtAuthGuard, FineGrainedPermissionGuard)
  @RequirePermission(User.name, 'create')
  @Post(':tenantID')
  async registerTenantUserWithPermission(
    @Param('tenantID') tenantId: string,
    @Body() body: CreateTenantUserDto
  ){
    return await this.usersService.registerTenantUserWithPermission(
      tenantId,
      body.name,
      body.email,
      body.permissionScopes
    )
  }


  @UseGuards(JwtAuthGuard,FineGrainedPermissionGuard)
  @RequirePermission(User.name, 'update')
  @Patch(':tenantID/:userId/permissions')
  async updateUserPermissionScopes(
    @Param('userId') userId: string,
    @Body() body: UpdateUserPermissionScopesDto
  ){
    return await this.usersService.updateUserPermissionScopes(
      userId,
      body.scopesToAdd,
      body.scopesToRemove
    )
  }

}
