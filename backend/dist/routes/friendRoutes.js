import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';
const router = Router();
// Gửi lời mời kết bạn
router.post('/request', protect, async (req, res) => {
    const { user } = req;
    const from = user._id;
    const { to } = req.body;
    if (from.toString() === to) {
        res.status(400).json({ error: 'Không thể tự gửi lời mời cho chính mình' });
        return;
    }
    const exists = await FriendRequest.findOne({ from, to, status: 'pending' });
    if (exists) {
        res.status(400).json({ error: 'Đã gửi lời mời trước đó' });
        return;
    }
    const userTo = await User.findById(to);
    if (!userTo) {
        res.status(404).json({ error: 'Người dùng không tồn tại' });
        return;
    }
    await FriendRequest.create({ from, to });
    res.json({ message: 'Đã gửi lời mời kết bạn' });
});
// Chấp nhận lời mời
router.post('/accept', protect, async (req, res) => {
    const { user } = req;
    const userId = user._id;
    const { requestId } = req.body;
    const request = await FriendRequest.findById(requestId);
    if (!request || request.to.toString() !== userId.toString()) {
        res.status(404).json({ error: 'Không tìm thấy lời mời' });
        return;
    }
    request.status = 'accepted';
    await request.save();
    await User.findByIdAndUpdate(userId, { $addToSet: { friends: request.from } });
    await User.findByIdAndUpdate(request.from, { $addToSet: { friends: userId } });
    res.json({ message: 'Đã chấp nhận kết bạn' });
});
// Từ chối lời mời
router.post('/reject', protect, async (req, res) => {
    const { user } = req;
    const userId = user._id;
    const { requestId } = req.body;
    const request = await FriendRequest.findById(requestId);
    if (!request || request.to.toString() !== userId.toString()) {
        res.status(404).json({ error: 'Không tìm thấy lời mời' });
        return;
    }
    request.status = 'rejected';
    await request.save();
    res.json({ message: 'Đã từ chối lời mời' });
});
// Hủy lời mời đã gửi
router.post('/cancel', protect, async (req, res) => {
    const { user } = req;
    const userId = user._id;
    const { requestId } = req.body;
    const request = await FriendRequest.findById(requestId);
    if (!request || request.from.toString() !== userId.toString()) {
        res.status(404).json({ error: 'Không tìm thấy lời mời' });
        return;
    }
    request.status = 'cancelled';
    await request.save();
    res.json({ message: 'Đã hủy lời mời' });
});
// Danh sách bạn bè
router.get('/list', protect, async (req, res) => {
    const { user } = req;
    const userId = user._id;
    const userDoc = await User.findById(userId).populate('friends', 'fullName email avatar isOnline lastSeen');
    res.json({ friends: userDoc?.friends || [] });
});
// GET /api/friends - alias cho /list
router.get('/', protect, async (req, res) => {
    const { user } = req;
    const userId = user._id;
    const userDoc = await User.findById(userId).populate('friends', 'fullName email avatar isOnline lastSeen');
    res.json({ friends: userDoc?.friends || [] });
});
// GET /api/friends/pending - trả về các lời mời kết bạn đang chờ
router.get('/pending', protect, async (req, res) => {
    const { user } = req;
    const userId = user._id;
    // Những lời mời gửi đến userId và status là pending
    const requests = await FriendRequest.find({ to: userId, status: 'pending' }).populate('from', 'fullName email avatar');
    res.json({ requests });
});
export default router;
