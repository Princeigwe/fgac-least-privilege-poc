import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
  ){}


  @UseGuards(JwtAuthGuard)
  @Get('overview')
  async getPermissionsOverview(){
    return await this.permissionsService.getPermissionsOverview()
  }
}
