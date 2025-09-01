// import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { firstValueFrom } from 'rxjs';

// @Injectable()
// export class MqttService {
//   private apiUrl: string;

//   constructor(private readonly httpService: HttpService) {
//     this.apiUrl =
//       process.env.API_URL || 'http://localhost:3003/agrosensor/data';
//     console.log('API URL:', this.apiUrl); // Verifica que la URL sea correcta
//   }

//   async processData(topic: string, message: any) {
//     console.log('Received message:' /*, message*/);

//     try {
//       const data = message;

//       console.log('Processing data:' /*, data*/);

//       // Envío de datos a la API
//       const response = await firstValueFrom(
//         this.httpService.post(this.apiUrl, data),
//       );
//       console.log('Data sent successfully:', response.data);
//     } catch (error) {
//       if (error.response) {
//         console.error('Error response from API:', error.response.data);
//         console.error('Status code:', error.response.status);
//         console.error('Headers:', error.response.headers);
//       } else if (error.request) {
//         console.error('No response received from API:', error.request);
//       } else {
//         console.error('Error setting up request:', error.message);
//       }
//     }
//   }
// }
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MqttService {
  private apiUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.apiUrl =
      process.env.API_URL + '/agrosensor/data' ||
      'http://localhost:3003/agrosensor/data';
    console.log('API URL:', this.apiUrl); // Verifica que la URL sea correcta
  }

  async processData(topic: string, message: any) {
    console.log('Received message:', message);
    try {
      // Añadir identificadores de cliente y estación
      /*const data = {
        ...message,
        clientId: '1',
        stationId: '1',
      };*/
      const data = {
        ...message,
        timestamp: new Date().toISOString(),
      };

      console.log('Processing data:', data);
      // Configura las cabeceras, incluyendo el token
      const headers = {
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
      };
      // Envío de datos a la API
      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl, data, { headers }),
      );
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error response from API:', error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received from API:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
  }
}
