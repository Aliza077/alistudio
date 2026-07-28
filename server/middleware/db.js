import { isDBConnected } from '../db.js';

export function requireDB(req, res, next) {
  if (!isDBConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Database is not connected. Check DATABASE in .env and MongoDB Atlas access.',
    });
  }
  next();
}
