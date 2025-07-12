import { Router, Request } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import Message from '../models/Message.js';

interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    email: string;
    fullName: string;
    role: string;
    friends?: string[];
  };
}

const router = Router();

// Gửi tin nhắn
router.post('/', protect, async (req, res): Promise<void> => {
  const { user } = req as AuthenticatedRequest;
  const from = user._id;
  const { to, content } = req.body;
  if (!content) {
    res.status(400).json({ error: 'Nội dung không được để trống' });
    return;
  }
  const msg = await Message.create({ from, to, content, status: 'sent', timestamp: new Date() });
  res.json({ message: 'Đã gửi tin nhắn', data: msg });
});

// Lấy lịch sử chat với 1 người
router.get('/:userId', protect, async (req, res): Promise<void> => {
  const { user } = req as AuthenticatedRequest;
  const userId = user._id;
  const otherId = req.params.userId;
  const messages = await Message.find({
    $or: [
      { from: userId, to: otherId },
      { from: otherId, to: userId }
    ]
  }).sort({ timestamp: 1 });
  res.json({ messages });
});

// Lấy tin nhắn chờ (pending)
router.get('/pending', protect, async (req, res): Promise<void> => {
  const { user } = req as AuthenticatedRequest;
  const userId = user._id;
  const messages = await Message.find({ to: userId, status: 'pending' }).sort({ createdAt: 1 });
  res.json({ messages });
});

// Khi chấp nhận bạn bè, chuyển tin nhắn pending sang accepted
router.post('/accept-pending', protect, async (req, res): Promise<void> => {
  const { user } = req as AuthenticatedRequest;
  const userId = user._id;
  const { fromId } = req.body;
  await Message.updateMany({ from: fromId, to: userId, status: 'pending' }, { $set: { status: 'accepted' } });
  res.json({ message: 'Đã chuyển tin nhắn sang accepted' });
});

export default router; 