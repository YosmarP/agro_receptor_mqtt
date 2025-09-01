import { Module } from '@nestjs/common';
import { MqttAdapter } from './adapters/mqtt.adapter';
import { MqttService } from './services/mqtt.service';
import { CronService } from './services/cron.service';
import { MqttController } from './controllers/mqtt.controller';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule'; // Añadir esto

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  controllers: [MqttController],
  providers: [MqttAdapter, MqttService, CronService],
})
export class AppModule {}
