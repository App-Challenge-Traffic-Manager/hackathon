import { Logger, Module, forwardRef } from '@nestjs/common';
import { HandlerService } from './handler.service';
import { PrismaService } from 'src/prisma.service';
import { SocketsModule } from 'src/sockets/sockets.module';

@Module({
  imports: [forwardRef(() => SocketsModule)],
  providers: [HandlerService, PrismaService, Logger],
  exports: [HandlerService],
})
export class HandlerModule {}
