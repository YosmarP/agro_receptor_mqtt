import { Injectable, OnModuleInit } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';
import * as dotenv from 'dotenv';
dotenv.config(); // Carga las variables de entorno

@Injectable()
export class MqttAdapter implements OnModuleInit {
  private client: MqttClient;

  onModuleInit() {
    const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
    this.client = connect(mqttBrokerUrl); // Configura el URL del broker

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
      // Procesa el mensaje o llama a un servicio para manejar los datos
      this.processReceivedMessage(topic, message.toString());
    });
  }
  processReceivedMessage(topic: string, message: string) {
    const parsedMessage = JSON.parse(message);

    // Extract clientId and stationId from the topic
    const topicParts = topic.split('/');
    const clientId = topicParts[1];
    const stationId = topicParts[3];

    const data = {
      sensor: parsedMessage.sensor,
      datos: parsedMessage.datos,
      //timestamp: parsedMessage.timestamp,
      clientId, // clientId extraído del topic
      stationId, // stationId extraído del topic
    };

    console.log('Processed message:', data);
    // Enviar a la API
    //this.processData(topic, data);
  }
}
