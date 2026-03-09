import { IsString, IsEmail, IsNotEmpty } from "class-validator";


export class CreateTenantUserDto{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  permissionScopes: string[];
}