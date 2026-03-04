import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  providers: [TenantsService],
  controllers: [TenantsController]
})
export class TenantsModule {}
