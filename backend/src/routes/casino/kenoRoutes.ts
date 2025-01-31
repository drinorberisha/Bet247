import express from 'express';
import { authenticateToken } from '../../middleware/auth';
import * as kenoController from '../../controllers/casino/kenoController';

const router = express.Router();

router.post('/start', authenticateToken, kenoController.startGame);
router.post('/cashout', authenticateToken, kenoController.cashoutGame);

export default router; 