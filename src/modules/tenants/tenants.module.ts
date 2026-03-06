import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Tenant } from './tenant.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { Permission } from '../permissions/permission.entity';


@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Tenant, Permission]),
    PermissionsModule
  ],
  providers: [TenantsService],
  controllers: [TenantsController]
})
export class TenantsModule {}
