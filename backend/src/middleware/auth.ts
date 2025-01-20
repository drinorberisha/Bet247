import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    // @ts-ignore
    req.user.userId = user._id;

    console.log('Auth middleware - User ID:', user._id);
    console.log('Auth middleware - User role:', user.role);
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // @ts-ignore
    const userId = req.user._id || req.user.userId;
    console.log('Admin middleware - Looking up user:', userId);

    const user = await User.findById(userId);
    
    if (!user) {
      console.log('Admin middleware - User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Admin middleware - User role:', user.role);
    if (!['admin', 'superuser'].includes(user.role)) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Error checking admin status' });
  }
};

export const requireSuperuser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'superuser') {
      return res.status(403).json({ message: 'Superuser access required' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking superuser status' });
  }
};

export default {
  authenticateToken,
  requireAdmin,
  requireSuperuser
};
