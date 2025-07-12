import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import Conversation from '../models/Conversation.js';
const router = Router();
// Lấy tất cả conversation của user
router.get('/', protect, async (req, res) => {
    const { user } = req;
    const userId = user._id;
    const conversations = await Conversation.find({ participants: userId })
        .populate('participants', 'fullName avatar isOnline')
        .populate({
        path: 'lastMessage',
        select: 'content timestamp from to'
    })
        .sort({ updatedAt: -1 });
    res.json({ conversations });
});
// Tạo hoặc lấy conversation giữa 2 user
router.post('/find-or-create', protect, async (req, res) => {
    const { user } = req;
    const userId = user._id;
    const { otherUserId } = req.body;
    let conversation = await Conversation.findOne({
        participants: { $all: [userId, otherUserId], $size: 2 }
    });
    if (!conversation) {
        conversation = await Conversation.create({ participants: [userId, otherUserId] });
    }
    res.json({ conversation });
});
export default router;
