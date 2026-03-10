import { IsOptional, IsEmail, IsString, IsBoolean, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreateUserDto{
  @ApiProperty({description: "The name of the user", example: "John Doe"})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({description: "The email address of the user", example: "johndoe@gmail.com"})
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({description: "The password of the user", example: "password123"})
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({description: "The active status of the user", example: true})
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({description: "The super admin status of the user", example: true})
  @IsBoolean()
  @IsOptional()
  isSuperAdmin?: boolean;

  @ApiProperty({description: "The tenant admin status of the user", example: false})
  @IsBoolean()
  @IsOptional()
  isTenantAdmin?: boolean;
}