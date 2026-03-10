import { IsString, IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTenantUserDto{
  @ApiProperty({description: "The name of tenant user", example: "John Doe"})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({description: "The name of tenant user", example: "johndoe@gmail.com"})
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({description: "The permission scopes for the tenant user", example: ["User: read", "Sale:update"]})
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  permissionScopes: string[];
}