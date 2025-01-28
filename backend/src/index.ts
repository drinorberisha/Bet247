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
import { WebSocketHandler } from './websocket/server';
import { MinesController } from './websocket/controllers/MinesController';
import { DatabaseService } from './services/DatabaseService';
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  import { startMatchResultsJob } from './jobs/matchResultsJob';

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
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

// Initialize WebSocket server
const wsHandler = new WebSocketHandler(server);

// Initialize database service
const dbService = new DatabaseService();

// Initialize game controllers
new MinesController(wsHandler, server, dbService);

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

export { app, wsHandler };