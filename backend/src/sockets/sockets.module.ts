import { Logger, Module } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';
import { SocketService } from './sockets.service';

@Module({
  providers: [SocketsGateway, SocketService, Logger],
  exports: [SocketService],
})
export class SocketsModule {}
