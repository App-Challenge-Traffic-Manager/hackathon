import { Logger, Module } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';
import { SocketService } from './sockets.service';
import { HandlerModule } from 'src/handler/handler.module';

@Module({
  imports: [HandlerModule],
  providers: [SocketsGateway, SocketService, Logger],
  exports: [SocketService],
})
export class SocketsModule {}
