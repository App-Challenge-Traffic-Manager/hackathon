import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './sockets.service';
import { OnModuleDestroy, Logger } from '@nestjs/common';

@WebSocketGateway()
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
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  onModuleDestroy() {
    this.server.close();
  }

  @SubscribeMessage('send_message')
  listenForMessages(@MessageBody() data: string) {
    this.server.sockets.emit('receive_message', data);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // get query params from client
    // const { room } = client.handshake.query;
    console.log(client.handshake.query);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
