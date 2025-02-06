import express from 'express';
import { authenticateToken } from '../../middleware/auth';
import * as slotsController from '../../controllers/casino/slotsController';

const router = express.Router();

console.log('[SLOTS] Setting up slots routes');

router.post('/spin', authenticateToken, slotsController.spin);
router.post('/submit-result', authenticateToken, slotsController.submitResult);
export default router; 