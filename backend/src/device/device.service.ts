import { Injectable } from '@nestjs/common';
import { Device } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

type PartialDevice = Partial<Device>;

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async updateDeviceById(id: string, data: PartialDevice): Promise<Device> {
    return await this.prisma.device.update({
      where: {
        id,
      },
      data,
    });
  }

  async updateDeviceByToken(
    token: string,
    data: PartialDevice,
  ): Promise<Device> {
    return await this.prisma.device.update({
      where: {
        token,
      },
      data,
    });
  }

  async getDeviceById(id: string): Promise<Device> {
    return await this.prisma.device.findUnique({
      where: {
        id,
      },
      include: {
        apps: true,
      },
    });
  }

  async getDeviceByToken(token: string): Promise<Device> {
    return await this.prisma.device.findUnique({
      where: {
        token,
      },
      include: {
        apps: true,
      },
    });
  }

  async fetchMultipleDevicesByIds(ids: string[]): Promise<Device[]> {
    return await this.prisma.device.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        apps: true,
      },
    });
  }

  async fetchMultipleDevicesByTokens(tokens: string[]): Promise<Device[]> {
    return await this.prisma.device.findMany({
      where: {
        token: {
          in: tokens,
        },
      },
      include: {
        apps: true,
      },
    });
  }
}
