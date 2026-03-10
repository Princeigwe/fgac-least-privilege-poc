import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantSaleDto } from './create.tenant.sale.dto';

export class UpdateTenantSaleDto extends PartialType(CreateTenantSaleDto) {}