import { IsOptional, IsEmail, IsString, IsBoolean, IsNotEmpty } from "class-validator";


export class CreateUserDto{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isSuperAdmin?: boolean;

  @IsBoolean()
  @IsOptional()
  isTenantAdmin?: boolean;
}