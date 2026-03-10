import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sales.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>
  ){}


  async createTenantSale(tenantId: string, amountMade: number){
    const sale = this.salesRepository.create({
      amountMade,
      tenant: {
        id: tenantId
      }
    })
    return await this.salesRepository.save(sale)
  }


  async readTenantSales(tenantId: string){
    return await this.salesRepository.find({
      where: {
        tenant: {
          id: tenantId
        }
      }
    })
  }


  async updateTenantSale(tenantId: string, saleId: string, amountMade: number){
    const sale = await this.salesRepository.findOne({
      where: {
        id: saleId,
        tenant: {
          id: tenantId
        }
      }
    })
    if(!sale){
      throw new HttpException('Sale not found', HttpStatus.NOT_FOUND)
    }
    sale.amountMade = amountMade
    return await this.salesRepository.save(sale)
  }


  async deleteTenantSale(tenantId: string, saleId: string){
    const sale = await this.salesRepository.findOne({
      where: {
        id: saleId,
        tenant: {
          id: tenantId
        }
      }
    })
    if(!sale){
      throw new HttpException('Sale not found', HttpStatus.NOT_FOUND)
    }
    await this.salesRepository.remove(sale)
    return {
      message: 'Sale deleted successfully'
    }
  }
}
