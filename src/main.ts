import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        url: process.env.MQTT_BROKER_URL, // Ajusta el URL a la configuración de tu broker Mosquitto
      },
    },
  );

  await app.listen();
}
bootstrap();
