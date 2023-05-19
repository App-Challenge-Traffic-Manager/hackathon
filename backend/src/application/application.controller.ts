import { Controller, Get, Param } from '@nestjs/common';
import { ApplicationService } from './application.service';

@Controller({
  path: 'applications',
  version: '1',
})
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get('device/:id')
  findAll(@Param('id') id: string) {
    return this.applicationService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }
}
