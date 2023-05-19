import { Injectable } from '@nestjs/common';
import { Application, Device } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

type PartialDevice = Partial<Device>;

type DeviceWithTotal = Device & {
  totalDownload: string;
  totalUpload: string;
};
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

  parseFromSize(size: string) {
    const value = size.slice(0, size.length - 2);
    const unit = size.slice(size.length - 2, size.length);
    const parsedValue = parseFloat(value);
    if (unit === 'KB') return parsedValue * 1024;
    if (unit === 'MB') return parsedValue * 1024 * 1024;
    if (unit === 'GB') return parsedValue * 1024 * 1024 * 1024;
    return parsedValue;
  }

  parseToSize(size: number) {
    if (size < 1024) return `${size.toFixed(2)}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)}KB`;
    if (size < 1024 * 1024 * 1024)
      return `${(size / 1024 / 1024).toFixed(2)}MB`;
    return `${(size / 1024 / 1024 / 1024).toFixed(2)}GB`;
  }

  sumDeviceDownload(apps: Application[]) {
    let total = 0;
    for (const app of apps) {
      total += this.parseFromSize(app.download);
    }
    return total;
  }

  sumDeviceUpload(apps: Application[]) {
    let total = 0;
    for (const app of apps) {
      total += this.parseFromSize(app.upload);
    }
    return total;
  }

  calculateTotalDownloadAndUpload(devices: any[]): DeviceWithTotal[] {
    const devicesWithTotal = devices.map((device) => {
      const totalDownload = this.sumDeviceDownload(device.apps);
      const totalUpload = this.sumDeviceUpload(device.apps);
      return {
        ...device,
        totalDownload: this.parseToSize(totalDownload),
        totalUpload: this.parseToSize(totalUpload),
      };
    });
    return devicesWithTotal;
  }

  async getDeviceById(id: string): Promise<DeviceWithTotal> {
    const device = await this.prisma.device.findUnique({
      where: {
        id,
      },
      include: {
        apps: true,
      },
    });

    const deviceWithTotal = this.calculateTotalDownloadAndUpload([device])[0];

    return deviceWithTotal;
  }

  async getDeviceByToken(token: string): Promise<DeviceWithTotal> {
    const device = await this.prisma.device.findUnique({
      where: {
        token,
      },
      include: {
        apps: true,
      },
    });

    const deviceWithTotal = this.calculateTotalDownloadAndUpload([device])[0];

    return deviceWithTotal;
  }

  async fetchMultipleDevicesByIds(ids: string[]): Promise<DeviceWithTotal[]> {
    const devices = await this.prisma.device.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        apps: true,
      },
    });

    const devicesWithTotal = this.calculateTotalDownloadAndUpload(devices);

    return devicesWithTotal;
  }

  async fetchMultipleDevicesByTokens(
    tokens: string[],
  ): Promise<DeviceWithTotal[]> {
    const devices = await this.prisma.device.findMany({
      where: {
        token: {
          in: tokens,
        },
      },
      include: {
        apps: true,
      },
    });

    const devicesWithTotal = this.calculateTotalDownloadAndUpload(devices);

    return devicesWithTotal;
  }
}
