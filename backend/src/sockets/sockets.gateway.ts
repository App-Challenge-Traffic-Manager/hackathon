import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './sockets.service';
import { OnModuleDestroy, Logger } from '@nestjs/common';
import { HandlerService } from 'src/handler/handler.service';
import { ApplicationData } from 'src/handler/interfaces/data.interface';

@WebSocketGateway({
  cors: true,
})
export class SocketsGateway
  implements
    OnGatewayInit,
    OnModuleDestroy,
    OnGatewayConnection,
    OnGatewayDisconnect
{
  constructor(
    private socketService: SocketService,
    private readonly logger: Logger,
    private readonly handlerService: HandlerService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  onModuleDestroy() {
    this.server.close();
  }

  @SubscribeMessage('receive-data')
  handleReceiveData(
    @MessageBody() data: ApplicationData[],
    @ConnectedSocket() client: Socket,
  ) {
    const token = client.handshake.query?.token?.toString();
    this.handlerService.handleData(token, data);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.handshake.query.token}`);
    this.handlerService.createDeviceIfNotExists(
      client.handshake.query?.token?.toString(),
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
