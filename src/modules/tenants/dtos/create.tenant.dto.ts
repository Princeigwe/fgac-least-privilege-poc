import { IsString, IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTenantDto{
  @ApiProperty({description: "The name of the tenant", example: "tenant1"})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({description: "The admin name of the tenant", example: "admin1"})
  @IsString()
  @IsNotEmpty()
  tenantAdminName: string;

  @ApiProperty({description: "The email address of the tenant admin", example: "admin1@gmail.com"})
  @IsEmail()
  @IsNotEmpty()
  tenantAdminEmail: string;
}