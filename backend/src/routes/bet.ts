import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  placeBet,
  getUserBets,
  getAllBets
} from '../controllers/betController';

const router = express.Router();

// Make sure authenticateToken is defined before using it
console.log('authenticateToken:', authenticateToken); // Debug log

// All bet routes require authentication
router.use(authenticateToken);

// Routes
router.post('/place', placeBet);
router.get('/user', getUserBets);
router.get('/all', getAllBets);

export default router; 