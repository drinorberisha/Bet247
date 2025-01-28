import { WebSocketServer, WebSocket } from 'ws';
import { parse } from 'url';
import jwt from 'jsonwebtoken';
import { Server } from 'http';

export interface WebSocketHandler {
  wss: WebSocketServer;
  getWss(): WebSocketServer;
  initialize(server: Server): void;
  broadcast(data: any): void;
}

class WebSocketService implements WebSocketHandler {
  wss: WebSocketServer;

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.setupConnectionHandler();
  }

  getWss(): WebSocketServer {
    return this.wss;
  }

  initialize(server: Server): void {
    server.on('upgrade', (request, socket, head) => {
      try {
        const { query } = parse(request.url!, true);
        const token = query.token as string;

        if (!token) {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }

        jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
          if (err) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
          }

          this.wss.handleUpgrade(request, socket, head, (ws) => {
            (ws as any).user = decoded;
            this.wss.emit('connection', ws, request);
          });
        });
      } catch (error) {
        console.error('WebSocket upgrade error:', error);
        socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n');
        socket.destroy();
      }
    });
  }

  broadcast(data: any): void {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  private setupConnectionHandler(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          // Handle incoming messages here
          console.log('Received:', data);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }
}

export const webSocketService = new WebSocketService(); 