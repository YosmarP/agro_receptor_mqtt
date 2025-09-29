import { Injectable, OnModuleInit } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';
import { MqttService } from '../services/mqtt.service';
import * as dotenv from 'dotenv';
dotenv.config(); // Carga las variables de entorno

// @Injectable()
// export class MqttAdapter implements OnModuleInit {
//   private client: MqttClient;

//   onModuleInit() {
//     const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
//     this.client = connect(mqttBrokerUrl); // Configura el URL del broker

//     this.client.on('connect', () => {
//       console.log('Connected to MQTT broker');
//       this.client.subscribe('client/+/station/+/sensor/data', (err) => {
//         if (err) {
//           console.error('Failed to subscribe:', err);
//         }
//       });
//     });

//     this.client.on('message', (topic, message) => {
//       console.log(`Received message on ${topic}: ${message.toString()}`);
//       // Procesa el mensaje o llama a un servicio para manejar los datos
//       this.processReceivedMessage(topic, message.toString());
//     });
//   }
//   processReceivedMessage(topic: string, message: string) {
//     const parsedMessage = JSON.parse(message);

//     // Extract clientId and stationId from the topic
//     const topicParts = topic.split('/');
//     const clientId = topicParts[1];
//     const stationId = topicParts[3];

//     const data = {
//       sensor: parsedMessage.sensor,
//       datos: parsedMessage.datos,
//       //timestamp: parsedMessage.timestamp,
//       clientId, // clientId extraído del topic
//       stationId, // stationId extraído del topic
//     };

//     console.log('Processed message:', data);
//     // Enviar a la API
//     //this.processData(topic, data);
//   }
// }

@Injectable()
export class MqttAdapter implements OnModuleInit {
  private client: MqttClient;

  constructor(private readonly mqttService: MqttService) {}

  onModuleInit() {
    const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
    this.client = connect(mqttBrokerUrl);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe('client/+/station/+/sensor/data', (err) => {
        if (err) {
          console.error('Failed to subscribe:', err);
        }
      });
    });

    this.client.on('message', (topic, message) => {
      console.log(`Received message on ${topic}: ${message.toString()}`);
      this.processReceivedMessage(topic, message.toString());
    });
  }

  processReceivedMessage(topic: string, message: string) {
    const parsedMessage = JSON.parse(message);
    const topicParts = topic.split('/');
    const clientId = topicParts[1];
    const stationId = topicParts[3];

    const data = {
      sensor: 'soil',
      datos: {
        humidity: parsedMessage.humidity,
        temperature: parsedMessage.temperature,
        EC: parsedMessage.EC,
        PH: parsedMessage.PH,
        N: parsedMessage.N,
        P: parsedMessage.P,
        K: parsedMessage.K,
        battery: parsedMessage.battery,
        Ai0: parsedMessage.Ai0,
        Di0: parsedMessage.Di0,
      },
      clientId,
      stationId,
      timestamp: parsedMessage.time,
    };

    console.log('Processed message:', data);
    this.mqttService.processData(topic, data); // ✅ ahora sí funciona
  }
}
