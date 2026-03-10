import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './sales.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Permission } from '../permissions/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, Tenant, Permission])
  ],
  providers: [SalesService],
  controllers: [SalesController]
})
export class SalesModule {}
