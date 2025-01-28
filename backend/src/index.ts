import express, { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import cors from "cors";
import path from 'path';
import mongoose from "mongoose";
import authRoutes from './routes/auth';
import betRoutes from './routes/bet';
import adminRoutes from './routes/adminRoutes';
import matchRoutes from './routes/matchRoutes';
import { SchedulerService } from './services/schedulerService';
import { createServer } from 'http';
import routes from "./routes";
import { WebSocket, WebSocketServer } from 'ws';
import { parse } from 'url';
import jwt from 'jsonwebtoken';
import { MinesController } from './websocket/controllers/MinesController';
import { DatabaseService } from './services/DatabaseService';
import config from './config/config';
import { startMatchResultsJob } from './jobs/matchResultsJob';
import { webSocketService } from './websocket';

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());

// Initialize WebSocket service
webSocketService.initialize(server);

// Export the WebSocket server instance
export const wss = webSocketService.getWss();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',    // Local Vue development
  'http://localhost:3000',    // Local alternative
  'https://bet247.vercel.app' // Production frontend
];

// CORS configuration
app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
// Basic route
app.get('/', (req, res) => {
  res.send('BET 24/7 API is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/matches', matchRoutes);
startMatchResultsJob();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("Connected to MongoDB");
    
    // Initialize scheduler after MongoDB connection is established
    const scheduler = new SchedulerService();
    scheduler.initializeSchedulers();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Initialize database service
const dbService = new DatabaseService();

// Initialize game controllers with webSocketService instead of wss
new MinesController(webSocketService, server, dbService);

// Routes
app.use("/api", routes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Keep your existing port configuration
const PORT = process.env.PORT || 5000;

// Update to use 'server' instead of 'app'
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Rejection:', error);
});

export default app;