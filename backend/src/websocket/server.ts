import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { parse as parseUrl } from 'url';
import User from '../models/User';

interface WebSocketClient extends WebSocket {
  userId?: string;
  isAlive?: boolean;
  isAuthenticated?: boolean;
}

interface DecodedToken {
  userId: string;
  role: string;
}

export class WebSocketHandler {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocketClient>;

  constructor(server: Server) {
    console.log('Initializing WebSocket server');
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.clients = new Map();
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', async (ws: WebSocketClient) => {
      console.log('New WebSocket connection attempt');
      
      // Set initial state
      ws.isAuthenticated = false;
      ws.isAlive = true;

      // Handle authentication message
      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message);
          
          if (data.action === 'authenticate') {
            const token = data.data.token;
            
            if (!token) {
              ws.send(JSON.stringify({
                type: 'auth',
                success: false,
                message: 'No token provided'
              }));
              return;
            }

            try {
              // Use the same verification as REST endpoints
              const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
              const user = await User.findById(decoded.userId);

              if (!user) {
                ws.send(JSON.stringify({
                  type: 'auth',
                  success: false,
                  message: 'User not found'
                }));
                return;
              }

              // Set up authenticated connection
              ws.userId = user._id.toString();
              ws.isAuthenticated = true;

              // Remove existing connection if any
              const existingClient = this.clients.get(ws.userId);
              if (existingClient) {
                existingClient.close();
              }
              
              this.clients.set(ws.userId, ws);

              // Send success response
              ws.send(JSON.stringify({
                type: 'auth',
                success: true,
                data: {
                  userId: user._id,
                  role: user.role
                }
              }));

            } catch (error) {
              ws.send(JSON.stringify({
                type: 'auth',
                success: false,
                message: 'Invalid token'
              }));
            }
          }
        } catch (error) {
          console.error('Message handling error:', error);
        }
      });

      // Handle disconnection
      ws.on('close', () => {
        if (ws.userId) {
          this.clients.delete(ws.userId);
        }
      });
    });

    // Set up heartbeat interval
    const interval = setInterval(() => {
      this.wss.clients.forEach((ws: WebSocketClient) => {
        if (!ws.isAlive) {
          if (ws.userId) {
            this.clients.delete(ws.userId);
          }
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    this.wss.on('close', () => {
      clearInterval(interval);
    });
  }

  public getWss(): WebSocketServer {
    return this.wss;
  }

  private async handleMessage(ws: WebSocketClient, data: any) {
    if (!ws.isAuthenticated) {
      console.log('Received message from unauthenticated client');
      return;
    }

    console.log('Handling message:', data);
  }

  public getClient(userId: string): WebSocketClient | undefined {
    return this.clients.get(userId);
  }

  public broadcast(message: any) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
} 