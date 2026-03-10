import { IsString, IsOptional, IsArray, ArrayUnique } from "class-validator";


export class UpdateUserPermissionScopesDto{
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  scopesToAdd?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  scopesToRemove?: string[];
}