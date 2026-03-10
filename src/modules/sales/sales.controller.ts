import { Controller, UseGuards, Post, Get, Patch, Delete, Body, Param} from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { FineGrainedPermissionGuard } from '../auth/guards/fine.grained.permission.guard';
import { RequirePermission } from '../auth/decorators/require.permission.decorator';
import { Sale } from './sales.entity';
import { CreateTenantSaleDto } from './dtos/create.tenant.sale.dto';
import { UpdateTenantSaleDto } from './dtos/update.tenant.sale.dto';


@Controller('sales')
export class SalesController {
  constructor(
    private readonly salesService: SalesService
  ){}

  @UseGuards(JwtAuthGuard, FineGrainedPermissionGuard)
  @RequirePermission(Sale.name, 'create')
  @Post(':tenantID')
  async createTenantSale(
    @Param('tenantID') tenantId: string,
    @Body() body: CreateTenantSaleDto
  ){
    return await this.salesService.createTenantSale(
      tenantId,
      body.amountMade
    )
  }


  @UseGuards(JwtAuthGuard, FineGrainedPermissionGuard)
  @RequirePermission(Sale.name, 'read')
  @Get(':tenantID')
  async readTenantSales(
    @Param('tenantID') tenantId: string
  ){
    return await this.salesService.readTenantSales(tenantId)
  }


  @UseGuards(JwtAuthGuard, FineGrainedPermissionGuard)
  @RequirePermission(Sale.name, 'update')
  @Patch(':tenantID/:saleId')
  async updateTenantSale(
    @Param('tenantID') tenantId: string,
    @Param('saleId') saleId: string,
    @Body() body: UpdateTenantSaleDto
  ){
    return await this.salesService.updateTenantSale(
      tenantId,
      saleId,
      body.amountMade
    )
  }

  @UseGuards(JwtAuthGuard, FineGrainedPermissionGuard)
  @RequirePermission(Sale.name, 'delete')
  @Delete(':tenantID/:saleId')
  async deleteTenantSale(
    @Param('tenantID') tenantId: string,
    @Param('saleId') saleId: string,
  ){
    return await this.salesService.deleteTenantSale(
      tenantId,
      saleId
    )
  }
}
