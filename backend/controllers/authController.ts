// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js'; 

interface RegisterBody {
  email: string;
  password: string;
  fullName: string;
  username?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface ForgotPasswordBody {
  email: string;
}

interface ResetPasswordBody {
  password: string;
}

const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (
  req: Request<unknown, unknown, RegisterBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password, fullName } = req.body;
    logger.info('Received register request', { email, fullName });

    // Validate input
    if (!email || !password || !fullName) {
      logger.warn('Missing required fields', { email: !!email, password: !!password, fullName: !!fullName });
      res.status(400).json({ message: 'Vui lòng cung cấp email, mật khẩu và họ tên', code: 'MISSING_FIELDS' });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      logger.warn('Invalid email format', { email });
      res.status(400).json({ message: 'Email không hợp lệ', code: 'INVALID_EMAIL' });
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      logger.warn('Weak password', { passwordLength: password.length });
      res.status(400).json({ 
        message: 'Mật khẩu phải có ít nhất 8 ký tự, chứa chữ hoa, số và ký tự đặc biệt',
        code: 'WEAK_PASSWORD'
      });
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(fullName)) {
      logger.warn('Invalid fullName format', { fullName });
      res.status(400).json({ message: 'Họ tên chỉ được chứa chữ cái và khoảng trắng', code: 'INVALID_FULLNAME' });
      return;
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      logger.warn('Email already exists', { email });
      res.status(409).json({ message: 'Email đã được sử dụng', code: 'EMAIL_EXISTS' });
      return;
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      fullName,
      role: 'student',
      status: 'active',
      subscriptionPlan: 'basic',
      level: 1,
      xp: 0,
      nextLevelXp: 1000,
      coins: 0,
      streak: 0,
      badges: [],
      subjects: [],
      recentActivities: [],
      progress: [],
    });

    logger.info('User created successfully', { id: user._id, email: user.email });

    const userId = user._id.toString();
    const token = generateToken(userId);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: {
        id: userId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Register error', { error });
    if (error instanceof mongoose.Error.ValidationError) {
      logger.warn('Validation error', { errors: error.errors });
      res.status(400).json({ message: Object.values(error.errors)[0].message, code: 'VALIDATION_ERROR' });
      return;
    }
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      logger.warn('Duplicate email', { email: req.body.email });
      res.status(409).json({ message: 'Email đã được sử dụng', code: 'EMAIL_EXISTS' });
      return;
    }
    res.status(500).json({ message: 'Lỗi server', code: 'SERVER_ERROR' });
  }
};

export const login = async (
  req: Request<unknown, unknown, LoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    logger.info('Received login request', { email });

    // Validate input
    if (!email || !password) {
      logger.warn('Missing required fields', { email: !!email, password: !!password });
      res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu', code: 'MISSING_FIELDS' });
      return;
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      logger.warn('Invalid credentials', { email });
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng', code: 'INVALID_CREDENTIALS' });
      return;
    }

    const userId = user._id.toString();
    const token = generateToken(userId);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: { id: userId, email, fullName: user.fullName, role: user.role },
    });
  } catch (error) {
    logger.error('Login error', { error });
    res.status(400).json({ message: 'Lỗi đăng nhập', code: 'LOGIN_ERROR' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  logger.info('Logout request');
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json({ message: 'Đăng xuất thành công' });
};

export const forgotPassword = async (
  req: Request<unknown, unknown, ForgotPasswordBody>,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    logger.info('Received forgot password request', { email });

    if (!email) {
      logger.warn('Missing email');
      res.status(400).json({ message: 'Vui lòng cung cấp email', code: 'MISSING_EMAIL' });
      return;
    }

    const user: IUser | null = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      logger.warn('User not found', { email });
      res.status(404).json({ message: 'Không tìm thấy người dùng', code: 'USER_NOT_FOUND' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Đặt lại mật khẩu',
      text: `Nhấp vào link để đặt lại mật khẩu: ${resetUrl}. Link hết hạn sau 10 phút.`,
    });

    logger.info('Password reset email sent', { email });
    res.status(200).json({ message: 'Email đặt lại mật khẩu đã được gửi' });
  } catch (error) {
    logger.error('Forgot password error', { error });
    res.status(500).json({ message: 'Lỗi gửi email', code: 'EMAIL_ERROR' });
  }
};

export const resetPassword = async (
  req: Request<{ token: string }, unknown, ResetPasswordBody>,
  res: Response
): Promise<void> => {
  try {
    const { password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    logger.info('Received reset password request', { token: hashedToken });

    if (!password) {
      logger.warn('Missing password');
      res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu mới', code: 'MISSING_PASSWORD' });
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      logger.warn('Weak password');
      res.status(400).json({ 
        message: 'Mật khẩu phải có ít nhất 8 ký tự, chứa chữ hoa, số và ký tự đặc biệt',
        code: 'WEAK_PASSWORD'
      });
      return;
    }

    const user: IUser | null = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      logger.warn('Invalid or expired token', { token: hashedToken });
      res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn', code: 'INVALID_TOKEN' });
      return;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info('Password reset successful', { email: user.email });
    res.status(200).json({ message: 'Mật khẩu đã được cập nhật' });
  } catch (error) {
    logger.error('Reset password error', { error });
    res.status(400).json({ message: 'Lỗi đặt lại mật khẩu', code: 'RESET_PASSWORD_ERROR' });
  }
};

export const getMe = async (
  req: Request & { user?: IUser },
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      logger.warn('No user authenticated');
      res.status(401).json({ message: 'Không có người dùng đăng nhập', code: 'UNAUTHENTICATED' });
      return;
    }
    const user: IUser | null = await User.findById(req.user._id).select('-password');
    if (!user) {
      logger.warn('User not found', { userId: req.user._id });
      res.status(404).json({ message: 'Không tìm thấy người dùng', code: 'USER_NOT_FOUND' });
      return;
    }
    logger.info('User info retrieved', { userId: user._id });
    res.status(200).json({ user });
  } catch (error) {
    logger.error('Get me error', { error });
    res.status(400).json({ message: 'Lỗi lấy thông tin', code: 'GET_ME_ERROR' });
  }
};