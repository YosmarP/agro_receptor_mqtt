import { Module } from '@nestjs/common';
import { MqttAdapter } from './adapters/mqtt.adapter';
import { MqttService } from './services/mqtt.service';
import { MqttController } from './controllers/mqtt.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MqttController],
  providers: [MqttAdapter, MqttService],
})
export class AppModule {}
