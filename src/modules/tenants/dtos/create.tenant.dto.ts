import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class CreateTenantDto{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  tenantAdminName: string;

  @IsEmail()
  @IsNotEmpty()
  tenantAdminEmail: string;
}