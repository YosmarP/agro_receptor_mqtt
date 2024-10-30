//Controlador para recibir y procesar los mensajes
//El controlador estará suscrito a un topic y utilizará el servicio para procesar los datos recibidos.
// import { Controller } from '@nestjs/common';
// import { EventPattern } from '@nestjs/microservices';
// import { MqttService } from '../services/mqtt.service';

// @Controller()
// export class MqttController {
//   constructor(private readonly mqttService: MqttService) {}

//   @EventPattern('sensor/data')
//   handleData(message: any) {
//     console.log('Message received in controller:', message);
//     this.mqttService.processData('sensor/data', message);
//   }
// }
import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, MqttContext } from '@nestjs/microservices';
import { MqttService } from '../services/mqtt.service';

@Controller()
export class MqttController {
  constructor(private readonly mqttService: MqttService) {}

  @EventPattern('client/+/station/+/sensor/data')
  handleData(@Payload() message: any, @Ctx() context: MqttContext) {
    const topic = context.getTopic();
    console.log('Message received in controller:', message);

    // Extraer clientId y stationId del topic
    const topicParts = topic.split('/');
    const clientId = topicParts[1];
    const stationId = topicParts[3];

    const data = {
      ...message,
      clientId,
      stationId,
    };

    this.mqttService.processData(topic, data);
  }
}
