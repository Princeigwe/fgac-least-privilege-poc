import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { User } from "../users/user.entity";


@Entity()
export class Permission{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column({type: 'json',default: () => "'[]'"})
  scopes: string[];

  @OneToOne(() => User, (user) => user.permission, { onDelete: 'CASCADE' })
  user: User;
}