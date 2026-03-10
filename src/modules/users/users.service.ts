import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { PasswordGenerator } from '../../utils/password.generator';
import * as bcrypt from 'bcrypt';
import { Tenant } from '../tenants/tenant.entity';
import { PermissionsService } from '../permissions/permissions.service';


const passwordGenerator = new PasswordGenerator();

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private permissionsService: PermissionsService,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>
  ){}

  async createSuperAdmin(
    name: string, 
    email: string,
    password: string,
    isActive: boolean,
  ){
    const user = this.usersRepository.create({
      name,
      email,
      password,
      isActive,
      isSuperAdmin: true,
    })
    return await this.usersRepository.save(user)
  }

  async createTenantUser(name: string, email: string, isTenantAdmin?:boolean){

    const existingUser = await this.getUserByEmail(email)
    if(existingUser){
      throw new HttpException("User already exists", HttpStatus.BAD_REQUEST)
    }

    let password = passwordGenerator.generatePassword()
    console.log("Plain password: ",password)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    password = hashedPassword

    const user = this.usersRepository.create({
      name,
      email,
      password,
      isActive: true,
      isTenantAdmin
    })
    return await this.usersRepository.save(user)
  }


  async getTenantUsers(tenantId: string){
    return await this.usersRepository.find({
      where: {
        tenant: {
          id: tenantId
        }
      }
    })
  }


  async getUserByEmail(email: string){
    return await this.usersRepository.findOne({
      where: {
        email
      }
    })
  }


  // this function is used by the passport-jwt strategy
  async getUserByIdAndEmail(id: string, email: string) {
    const user = await this.usersRepository.findOneBy({ id, email })
    if (!user) {
      throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST)
    }
    return user
  }


  async registerTenantUserWithPermission(tenantID: string, name: string, email: string, scopes: string[]){
    await this.permissionsService.validatePermissionScopes(scopes)
    const newUser = await this.createTenantUser(name, email)
    const tenant = await this.tenantRepository.findOne({
      where: {
        id: tenantID
      },
      relations: ['users'],
    })
    if (!tenant) {
      throw new HttpException(`Tenant with ID ${tenantID} not found`, HttpStatus.NOT_FOUND);
    }
    tenant.users.push(newUser);
    await this.tenantRepository.save(tenant)

    const permission = await this.permissionsService.assignNewUserPermission(
      newUser,
      tenant.id,
      scopes
    )

    return{
      newUser,
      tenant,
      permission
    }
  }


  async updateUserPermissionScopes(userId: string, scopesToAdd?: string[], scopesToRemove?: string[]){
    if(!scopesToAdd && !scopesToRemove){
      throw new HttpException('No scopes to add or remove', HttpStatus.BAD_REQUEST)
    }
    const user = await this.usersRepository.findOne({
      where: {
        id: userId
      },
      relations: ['permission']
    })
    if(!user){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    if(scopesToAdd || scopesToRemove){
      return await this.permissionsService.updatePermission(
        user.permission.id,
        scopesToAdd,
        scopesToRemove
      )
    }
  }
}

