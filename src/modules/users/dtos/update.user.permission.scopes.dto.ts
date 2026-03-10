import { IsString, IsOptional, IsArray, ArrayUnique } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class UpdateUserPermissionScopesDto{
  @ApiProperty({description: "The scopes to add to the user", example: ["Sale:read", "User:delete"]})
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  scopesToAdd?: string[];

  @ApiProperty({description: "The scopes to remove from the user", example: ["Sale:read", "User:delete"]})
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  scopesToRemove?: string[];
}