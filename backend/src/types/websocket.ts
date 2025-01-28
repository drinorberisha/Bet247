import { WebSocket } from 'ws';

export interface WebSocketMessage {
  type: string;
  payload: any;
}

export interface WebSocketClient extends WebSocket {
  userId?: string;
  isAlive?: boolean;
  isAuthenticated?: boolean;
} 