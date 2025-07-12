// src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login, logout, forgotPassword, resetPassword, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';

const router: Router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);

// Tìm kiếm user theo tên hoặc email
router.get('/search', protect, async (req, res): Promise<void> => {
  const { q } = req.query;
  if (!q || typeof q !== 'string' || q.trim().length < 2) {
    res.status(400).json({ error: 'Từ khóa tìm kiếm quá ngắn' });
    return;
  }
  const keyword = q.trim();
  // Tìm user theo tên hoặc email, loại trừ chính mình
  const users = await User.find({
    $or: [
      { fullName: { $regex: keyword, $options: 'i' } },
      { email: { $regex: keyword, $options: 'i' } }
    ],
    // @ts-expect-error: req.user không có trong type mặc định của Express
    _id: { $ne: req.user._id }
  }).select('_id fullName email avatar');
  res.json({ users });
  return;
});

export default router;