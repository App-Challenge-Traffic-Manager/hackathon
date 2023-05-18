import { Injectable, Logger } from '@nestjs/common';
import { Device } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ApplicationData } from './interfaces/data.interface';

@Injectable()
export class HandlerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async checkIfDeviceExists(token: string): Promise<Device> {
    const device = await this.prisma.device.findUnique({
      where: {
        token,
      },
    });
    return device;
  }

  async createDeviceIfNotExists(token: string): Promise<Device> {
    const device = await this.checkIfDeviceExists(token);
    if (!device)
      return await this.prisma.device.create({
        data: {
          token,
        },
      });

    return device;
  }

  async handleData(token: string, data: ApplicationData[]): Promise<void> {
    console.log(`received data - ${token} - ${data.length}`);
    const device = await this.checkIfDeviceExists(token);
    if (!device) return;

    for (const application of data) {
      try {
        await this.createApplicationIfNotExists(token, application);
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  async createApplicationIfNotExists(
    token: string,
    application: ApplicationData,
  ): Promise<void> {
    const device = await this.checkIfDeviceExists(token);
    if (!device) return;

    const applicationExists = await this.prisma.application.findFirst({
      where: {
        name: application.name.replace(/[^\x00-\x7F]/g, ''),
        deviceId: device.id,
      },
    });

    if (!applicationExists) {
      await this.prisma.application.create({
        data: {
          name: application.name,
          upload: application.upload,
          download: application.download,
          upload_speed: application.upload_speed,
          download_speed: application.download_speed,
          started_at: application.create_time,
          last_updated_at: application.last_time_update,
          protocol_traffics: {
            create: application.protocol_traffic.map((protocol) => ({
              protocol: protocol.protocol,
              upload: protocol.upload,
              download: protocol.download,
            })),
          },
          host_traffics: {
            create: application.host_traffic.map((host) => ({
              host: host.host,
              upload: host.upload,
              download: host.download,
            })),
          },
          Device: {
            connect: {
              id: device.id,
            },
          },
        },
      });

      await this.deleteDuplicateApplicationsAndAggregates();
    } else {
      await this.prisma.application.update({
        where: {
          id: applicationExists.id,
        },
        data: {
          name: application.name,
          upload: application.upload,
          download: application.download,
          upload_speed: application.upload_speed,
          download_speed: application.download_speed,
          started_at: application.create_time,
          last_updated_at: application.last_time_update,
        },
      });

      for (const protocol of application.protocol_traffic) {
        const protocolExists = await this.prisma.protocolTraffic.findFirst({
          where: {
            protocol: protocol.protocol,
            applicationId: applicationExists.id,
          },
        });

        if (!protocolExists) {
          try {
            await this.prisma.protocolTraffic.create({
              data: {
                protocol: protocol.protocol,
                upload: protocol.upload,
                download: protocol.download,
                Application: {
                  connect: {
                    id: applicationExists.id,
                  },
                },
              },
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          await this.prisma.protocolTraffic.update({
            where: {
              id: protocolExists.id,
            },
            data: {
              protocol: protocol.protocol,
              upload: protocol.upload,
              download: protocol.download,
            },
          });
        }
      }

      for (const host of application.host_traffic) {
        const hostExists = await this.prisma.hostTraffic.findFirst({
          where: {
            host: host.host,
            applicationId: applicationExists.id,
          },
        });

        if (!hostExists) {
          try {
            await this.prisma.hostTraffic.create({
              data: {
                host: host.host,
                upload: host.upload,
                download: host.download,
                Application: {
                  connect: {
                    id: applicationExists.id,
                  },
                },
              },
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          await this.prisma.hostTraffic.update({
            where: {
              id: hostExists.id,
            },
            data: {
              host: host.host,
              upload: host.upload,
              download: host.download,
            },
          });
        }
      }
    }
  }

  async deleteDuplicateApplicationsAndAggregates(): Promise<void> {
    const applications = await this.prisma.application.findMany({
      include: {
        protocol_traffics: true,
        host_traffics: true,
      },
    });

    for (const application of applications) {
      const duplicateApplications = await this.prisma.application.findMany({
        where: {
          name: application.name,
          deviceId: application.deviceId,
          id: {
            not: application.id,
          },
        },
      });

      for (const duplicateApplication of duplicateApplications) {
        console.log(
          `Deleting duplicate applications and aggregates - ${duplicateApplication.id}`,
        );
        try {
          await this.prisma.protocolTraffic.deleteMany({
            where: {
              applicationId: duplicateApplication.id,
            },
          });

          await this.prisma.hostTraffic.deleteMany({
            where: {
              applicationId: duplicateApplication.id,
            },
          });
        } catch (error) {
          this.logger.warn(duplicateApplication.id);
          this.logger.error(error);
        }

        await this.prisma.application.deleteMany({
          where: {
            id: { in: duplicateApplications.map((app) => app.id) },
          },
        });
      }
    }
  }
}
