import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CronService {
  private apiUrl: string;
  constructor(private readonly httpService: HttpService) {
    this.apiUrl = process.env.API_URL || 'http://localhost:3003';
    console.log('API URL:', this.apiUrl); // Verifica que la URL sea correcta
  }
  // @Cron(CronExpression.EVERY_MINUTE, {
  // @Cron(CronExpression.EVERY_DAY_AT_8AM, {
  //   timeZone: 'Europe/Madrid',
  // })
  async executeContingencyCron() {
    console.log('Ejecutando cron job aemet...');
    try {
      // Configura las cabeceras, incluyendo el token
      const headers = {
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
      };
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/aemetcron/execute`, { headers }),
      );
      console.log('Respuesta de la API:', response.data);
    } catch (error) {
      console.error('Error al llamar a la API:', error);
    }
  }
  // @Cron(CronExpression.EVERY_MINUTE, {
  //   // @Cron(CronExpression.EVERY_DAY_AT_9AM, {
  //   timeZone: 'Europe/Madrid',
  // })
  async executeaemetCron() {
    console.log('Ejecutando cron job contingency...');
    try {
      const headers = {
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
      };
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/contingencycron/execute`, {
          headers,
        }),
      );
      console.log('Respuesta de la API:', response.data);
    } catch (error) {
      console.error('Error al llamar a la API:', error);
    }
  }

    @Cron(CronExpression.EVERY_10_MINUTES, {
    timeZone: 'Europe/Madrid',
  })
  async keepAlivePing() {
    console.log('Ejecutando cron job keep-alive...');
    try {
      const headers = {
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
      };
      const response = await firstValueFrom(
       this.httpService.get(
          `${process.env.API_URL}/agrosensor/data?stationId=1`,
          { headers },
        ),
      );
      console.log('Keep-alive OK:', response.status);
    } catch (error) {
      console.error('Error en keep-alive:', error.message);
    }
  }

}
