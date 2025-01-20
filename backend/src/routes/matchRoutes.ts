import express from 'express';
import { authenticateToken } from '../middleware/auth';
import * as matchController from '../controllers/matchController';

const router = express.Router();

// Public routes
router.get('/matches', matchController.getMatches);
router.get('/matches/:id', matchController.getMatchById);
router.get('/sports', matchController.getSports);

// Protected routes (require authentication)
router.use(authenticateToken);
router.post('/refresh-odds', matchController.refreshOdds);

export default router; 