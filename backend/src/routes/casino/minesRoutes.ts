import express from 'express';
import { authenticateToken } from '../../middleware/auth';
import * as minesController from '../../controllers/casino/minesController';

const router = express.Router();

router.post('/start', authenticateToken, minesController.startGame);
router.post('/cashout', authenticateToken, minesController.cashoutGame);

export default router;