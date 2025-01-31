import express from 'express';
import minesRoutes from './minesRoutes';
import kenoRoutes from './kenoRoutes';

const router = express.Router();

router.use('/mines', minesRoutes);
router.use('/keno', kenoRoutes);

export default router; 