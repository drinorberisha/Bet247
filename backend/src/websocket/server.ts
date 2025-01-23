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
    this.wss.on('connection', async (ws: WebSocketClient, request) => {
      console.log('New WebSocket connection attempt');
      
      try {
        // Parse the URL and get the token from query parameters
        const { query } = parseUrl(request.url || '', true);
        const token = query.token as string;

        if (!token) {
          console.log('No token provided');
          ws.close(4001, 'No token provided');
          return;
        }

        // Verify token and get user
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        const user = await User.findById(decoded.userId);

        if (!user) {
          console.log('User not found');
          ws.close(4001, 'User not found');
          return;
        }

        // Set up initial connection state
        ws.userId = user._id.toString();
        ws.isAlive = true;
        ws.isAuthenticated = true;
        
        // Remove any existing connection for this user
        const existingClient = this.clients.get(ws.userId);
        if (existingClient) {
          console.log('Closing existing connection for user:', ws.userId);
          existingClient.close();
        }
        
        this.clients.set(ws.userId, ws);

        // Send authentication success message
        ws.send(JSON.stringify({
          type: 'auth',
          success: true,
          data: {
            userId: user._id,
            role: user.role
          }
        }));

        console.log('Client authenticated successfully:', ws.userId);

        // Set up ping-pong heartbeat
        ws.on('pong', () => {
          ws.isAlive = true;
        });

        // Handle messages
        ws.on('message', async (message: string) => {
          try {
            const data = JSON.parse(message);
            
            if (data.action === 'ping') {
              ws.send(JSON.stringify({ type: 'pong' }));
              return;
            }

            await this.handleMessage(ws, data);
          } catch (error) {
            console.error('Message handling error:', error);
          }
        });

        // Handle disconnection
        ws.on('close', () => {
          if (ws.userId) {
            console.log('Client disconnected normally:', ws.userId);
            this.clients.delete(ws.userId);
          }
        });

      } catch (error) {
        console.error('WebSocket authentication error:', error);
        ws.close(4001, 'Authentication failed');
      }
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