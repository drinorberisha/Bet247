import { parse } from 'url';
import jwt from 'jsonwebtoken';

// During WebSocket connection setup
wss.on('connection', (ws, req) => {
  try {
    const { query } = parse(req.url!, true);
    const token = query.token as string;
    
    if (!token) {
      ws.close(4001, 'Authentication required');
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Store the user information in the WebSocket connection
    ws.user = decoded;
    
    // Continue with normal connection setup...
  } catch (error) {
    console.error('WebSocket authentication error:', error);
    ws.close(4001, 'Authentication failed');
  }
}); 