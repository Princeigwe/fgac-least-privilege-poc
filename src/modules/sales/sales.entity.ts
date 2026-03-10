import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Tenant } from "../tenants/tenant.entity";


@Entity('sales')
export class Sale{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amountMade: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.sales, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenantId' }) 
  tenant: Tenant;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

}