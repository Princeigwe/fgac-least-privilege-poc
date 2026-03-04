import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Tenant } from "../tenants/tenant.entity";
import { Permission } from "../permissions/permission.entity";

@Entity('users')
export class User{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({default: false})
  isSuperAdmin: boolean

  @Column({default: false})
  isTenantAdmin: boolean

  @ManyToOne(() => Tenant, (tenant) => tenant.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenantId' }) 
  tenant: Tenant;

  @OneToOne(() => Permission, (permission) => permission.user, {
    cascade: true,
  })
  @JoinColumn() 
  permission: Permission
}