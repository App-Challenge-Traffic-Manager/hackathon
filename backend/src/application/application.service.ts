import { Injectable } from '@nestjs/common';
import { Application } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(deviceId: string) {
    const applications: Application[] = await this.prisma.application.findMany({
      where: {
        Device: {
          id: deviceId,
        },
      },
      include: {
        host_traffics: true,
        protocol_traffics: true,
      },
    });

    return applications;
  }

  findOne(id: string) {
    return this.prisma.application.findUnique({
      where: {
        id: id,
      },
      include: {
        host_traffics: true,
        protocol_traffics: true,
      },
    });
  }
}
