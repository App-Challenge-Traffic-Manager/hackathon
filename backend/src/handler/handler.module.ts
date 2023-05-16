import { Logger, Module } from '@nestjs/common';
import { HandlerService } from './handler.service';
import { HandlerController } from './handler.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [HandlerController],
  providers: [HandlerService, PrismaService, Logger],
  exports: [HandlerService],
})
export class HandlerModule {}
