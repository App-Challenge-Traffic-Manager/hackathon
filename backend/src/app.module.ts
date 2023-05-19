import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { SocketsModule } from './sockets/sockets.module';
import { HandlerModule } from './handler/handler.module';
import { DeviceModule } from './device/device.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    SocketsModule,
    HandlerModule,
    DeviceModule,
    ApplicationModule,
  ],
  providers: [],
})
export class AppModule {}
