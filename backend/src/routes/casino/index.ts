import express from 'express';
import minesRoutes from './minesRoutes';
import kenoRoutes from './kenoRoutes';
import rouletteRoutes from './rouletteRoutes';

const router = express.Router();

console.log('[CASINO] Setting up casino routes');

// Debug route
router.get('/test', (req, res) => {
  console.log('[CASINO] Test route hit');
  res.json({ message: 'Casino routes are working' });
});

// Mount casino game routes with logging
router.use('/mines', (req, res, next) => {
  console.log('[CASINO] Mines route hit');
  next();
}, minesRoutes);

router.use('/keno', (req, res, next) => {
  console.log('[CASINO] Keno route hit');
  next();
}, kenoRoutes);

router.use('/roulette', (req, res, next) => {
  console.log('[CASINO] Roulette route hit');
  next();
}, rouletteRoutes);

console.log('[CASINO] Casino routes mounted');

export default router; 