import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { WebSocketClient } from '../../types/websocket';

export class WebSocketHandler {
  private wss: WebSocketServer;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.initialize();
  }

  public getWss(): WebSocketServer {
    return this.wss;
  }

  private initialize() {
    this.wss.on('connection', (ws: WebSocketClient) => {
      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
      });
    });

    setInterval(() => {
      this.wss.clients.forEach((ws: WebSocketClient) => {
        if (!ws.isAlive) {
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  public broadcast(data: any) {
    this.wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
} 