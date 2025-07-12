// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';

interface JwtPayload {
  id: string;
}

export const protect = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Lấy token từ cookie
  token = req.cookies.jwt;

  if (!token) {
    res.status(401).json({ message: 'Không có token, vui lòng đăng nhập' });
    return;
  }

  try {
    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ message: 'Người dùng không tồn tại' });
      return;
    }

    req.user = user;
    next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Token không hợp lệ';
    res.status(401).json({ message });
  }
};