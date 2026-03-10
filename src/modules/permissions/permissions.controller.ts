import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { PermissionsOverviewResponseDto } from './dtos/permissions.overview.response.dto';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
  ){}



  @ApiOperation({description: "This endpoint returns the available permission scopes. The user only need to be authenticated for this"})
  @ApiOkResponse({type: PermissionsOverviewResponseDto})
  @UseGuards(JwtAuthGuard)
  @Get('overview')
  async getPermissionsOverview(){
    return await this.permissionsService.getPermissionsOverview()
  }
}
