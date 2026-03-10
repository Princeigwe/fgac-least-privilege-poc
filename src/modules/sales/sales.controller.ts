import { Controller, UseGuards, Post, Get, Patch, Delete, Body, Param} from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { FineGrainedPermissionGuard } from '../auth/guards/fine.grained.permission.guard';
import { RequirePermission } from '../auth/decorators/require.permission.decorator';
import { Sale } from './sales.entity';
import { CreateTenantSaleDto } from './dtos/create.tenant.sale.dto';
import { UpdateTenantSaleDto } from './dtos/update.tenant.sale.dto';
import { ApiOperation, ApiTags, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';


@ApiTags('Sales')
@ApiBearerAuth() 
@Controller('sales')
export class SalesController {
  constructor(
    private readonly salesService: SalesService
  ){}

  @ApiOperation({description: "This endpoint creates a sales record for a tenant, with the permission scope of 'Sale:create"})
  @ApiBody({type: CreateTenantSaleDto})
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


  @ApiOperation({description: "This endpoint reads all sales records for a tenant, with the permission scope of 'Sale:read"})
  @ApiParam({name: 'tenantID', description: 'The ID of the tenant'})
  @UseGuards(JwtAuthGuard, FineGrainedPermissionGuard)
  @RequirePermission(Sale.name, 'read')
  @Get(':tenantID')
  async readTenantSales(
    @Param('tenantID') tenantId: string
  ){
    return await this.salesService.readTenantSales(tenantId)
  }


  @ApiOperation({description: "This endpoint updates a sales record for a tenant, with the permission scope of 'Sale:update"})
  @ApiBody({type: UpdateTenantSaleDto})
  @ApiParam({name: 'tenantID', description: 'The ID of the tenant'})
  @ApiParam({name: 'saleId', description: 'The ID of the sale'})
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

  @ApiOperation({description: "This endpoint deletes a sales record of a tenant, with the permission scope of 'Sale:delete"})
  @ApiParam({name: 'tenantID', description: 'The ID of the tenant'})
  @ApiParam({name: 'saleId', description: 'The ID of the sale'})
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
