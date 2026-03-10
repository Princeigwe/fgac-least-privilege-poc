import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "../users/user.entity";
import { Sale } from "../sales/sales.entity";


@Entity('tenants')
export class Tenant{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Sale, (sale) => sale.tenant)
  sales: Sale[];

}