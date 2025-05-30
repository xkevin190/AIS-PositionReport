import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import { AisService } from './ais.service';

@Injectable()
export class AisGateway implements OnModuleInit {
  private readonly logger = new Logger(AisGateway.name);
  private socket: WebSocket;

  constructor(private readonly aisService: AisService) {}

  onModuleInit() {
    this.connectToAisStream();
  }

  private connectToAisStream() {
    this.socket = new WebSocket(`wss://stream.aisstream.io/v0/stream`);

    this.socket.on('open', () => {
      this.logger.log('Connected to AIS stream');
      this.socket.send(
        JSON.stringify({
          BoundingBoxes: [
            [
              [90, -180],
              [-90, 180],
            ],
          ],
          Apikey: process.env.AISSTREAM_API_KEY,
          filterMessageTypess: ['PositionReport'],
        }),
      );
    });

    this.socket.on('message', async (data: WebSocket.RawData) => {
      try {
        // console.log('Received data from AIS stream:', data.toString());
        const parsedMessage = JSON.parse(data.toString());

        this.aisService.handlePositionReport(parsedMessage);

      } catch (err) {
        this.logger.error('Error parsing AIS message', err);
      }
    });

    this.socket.on('error', (err) => {
      this.logger.error('WebSocket error:', err);
    });

    this.socket.on('close', () => {
      this.logger.warn('WebSocket closed. Reconnecting in 5s...');
      setTimeout(() => this.connectToAisStream(), 5000);
    });
  }
}
