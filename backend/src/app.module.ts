import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { SocketsModule } from './sockets/sockets.module';
import { HandlerModule } from './handler/handler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    SocketsModule,
    HandlerModule,
  ],
  providers: [],
})
export class AppModule {}
