import { ApiProperty } from '@nestjs/swagger';

export class PermissionsOverviewResponseDto {
  @ApiProperty({
    type: [String],
    example: [
      "User:create",
      "User:read",
      "User:update",
      "User:delete",
      "Tenant:create",
      "Tenant:read",
      "Tenant:update",
      "Tenant:delete",
      "Sale:create",
      "Sale:read",
      "Sale:update",
      "Sale:delete"
    ]
  })
  permissions: string[];
}