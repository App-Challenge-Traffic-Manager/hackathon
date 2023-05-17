import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { Device } from '@prisma/client';
import { DeviceService } from './device.service';

@Controller({
  path: 'devices',
  version: '1',
})
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get(':id/by-id')
  async getDeviceById(@Param('id') id: string): Promise<Device> {
    return await this.deviceService.getDeviceById(id);
  }

  @Get(':token/by-token')
  async getDeviceByToken(@Param('token') token: string): Promise<Device> {
    return await this.deviceService.getDeviceByToken(token);
  }

  @Patch(':id/by-id')
  async updateDeviceById(
    @Param('id') id: string,
    @Body() data: Partial<Device>,
  ): Promise<Device> {
    return await this.deviceService.updateDeviceById(id, data);
  }

  @Patch(':token/by-token')
  async updateDeviceByToken(
    @Param('token') token: string,
    @Body() data: Partial<Device>,
  ): Promise<Device> {
    return await this.deviceService.updateDeviceByToken(token, data);
  }

  @Get('by-ids?')
  async fetchMultipleDevicesByIds(
    @Query('ids') ids: string,
  ): Promise<Device[]> {
    return await this.deviceService.fetchMultipleDevicesByIds(ids.split(','));
  }

  @Get('by-tokens?')
  async fetchMultipleDevicesByTokens(
    @Query('tokens') tokens: string,
  ): Promise<Device[]> {
    return await this.deviceService.fetchMultipleDevicesByTokens(
      tokens.split(','),
    );
  }
}
