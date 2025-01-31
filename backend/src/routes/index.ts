import express from 'express';
import authRoutes from './auth';
import betRoutes from './bet';
import matchRoutes from './matchRoutes';
import adminRoutes from './adminRoutes';
import casinoRoutes from './casino';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/bets', betRoutes);
router.use('/matches', matchRoutes);
router.use('/admin', adminRoutes);
router.use('/casino', casinoRoutes);

export default router; 
