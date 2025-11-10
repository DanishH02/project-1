import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class NetworkingService {
  private readonly logger = new Logger(NetworkingService.name);
  private authClient: ClientProxy;

  constructor() {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10),
      },
    });
  }

  send<T>(pattern: string, data: any): Observable<T> {
    this.logger.debug(`Sending message: ${pattern}`);
    return this.authClient.send<T>(pattern, data);
  }

  async onModuleDestroy() {
    await this.authClient.close();
  }
}

