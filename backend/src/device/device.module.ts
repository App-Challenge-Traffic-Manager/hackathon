import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { PrismaService } from 'src/prisma.service';
import { HandlerModule } from 'src/handler/handler.module';

@Module({
  imports: [HandlerModule],
  controllers: [DeviceController],
  providers: [DeviceService, PrismaService],
})
export class DeviceModule {}
