import { Logger, Module } from '@nestjs/common';
import { HandlerService } from './handler.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [HandlerService, PrismaService, Logger],
  exports: [HandlerService],
})
export class HandlerModule {}
