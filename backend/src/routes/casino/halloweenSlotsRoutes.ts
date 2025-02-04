import express from 'express';
import { authenticateToken } from '../../middleware/auth';
import { startGame, processWin } from '../../controllers/casino/halloweenSlotsController';

const router = express.Router();

router.post('/start', authenticateToken, startGame);
router.post('/win', authenticateToken, processWin);

export default router; 