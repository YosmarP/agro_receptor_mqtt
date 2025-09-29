import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';
// import * as crypto from 'crypto';

(global as any).randomUUID = randomUUID;

// (global as any).crypto = crypto;
dotenv.config(); // Carga las variables de entorno
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        url: process.env.MQTT_BROKER_URL,
        clientId: 'agrosensor-client',
        clean: false,
        subscribeOptions: {
          qos: 1, // 👈 Asegura entrega garantizada
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
