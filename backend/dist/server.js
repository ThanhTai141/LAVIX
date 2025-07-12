import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { logger } from './utils/logger.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import User from './models/User.js';
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
// Kiểm tra biến môi trường
if (!MONGODB_URI) {
    console.error('MONGODB_URI không được định nghĩa trong .env');
    process.exit(1);
}
if (!JWT_SECRET) {
    console.error('JWT_SECRET không được định nghĩa trong .env');
    process.exit(1);
}
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    },
});
// Map userId <-> socketId
const onlineUsers = new Map();
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        User.findByIdAndUpdate(userId, { isOnline: true }, { new: true }).exec();
        onlineUsers.set(userId, socket.id);
    }
    // Lắng nghe gửi tin nhắn
    socket.on('send_message', async (data) => {
        const { from, to, content } = data;
        if (!from || !to || !content)
            return;
        // Lưu DB
        const Message = (await import('./models/Message.js')).default;
        const msg = await Message.create({ from, to, content, status: 'sent', timestamp: new Date() });
        // Emit cho người nhận nếu online
        const toSocketId = onlineUsers.get(to);
        if (toSocketId) {
            io.to(toSocketId).emit('receive_message', msg);
        }
        // Emit lại cho người gửi (xác nhận gửi thành công)
        // socket.emit('message_sent', msg);
    });
    // Thêm typing indicator events (không ảnh hưởng chức năng cũ)
    socket.on('typing_start', (data) => {
        const { from, to } = data;
        if (!from || !to)
            return;
        const toSocketId = onlineUsers.get(to);
        if (toSocketId) {
            io.to(toSocketId).emit('user_typing_start', { from, to });
        }
    });
    socket.on('typing_stop', (data) => {
        const { from, to } = data;
        if (!from || !to)
            return;
        const toSocketId = onlineUsers.get(to);
        if (toSocketId) {
            io.to(toSocketId).emit('user_typing_stop', { from, to });
        }
    });
    socket.on('disconnect', async () => {
        if (userId) {
            await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() }, { new: true }).exec();
            onlineUsers.delete(userId);
        }
    });
});
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use('/api/auth/login', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Quá nhiều yêu cầu, thử lại sau 15 phút',
}));
app.use('/api/auth/register', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Quá nhiều yêu cầu, thử lại sau 15 phút',
}));
app.use('/api/auth/forgot-password', rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Quá nhiều yêu cầu, thử lại sau 1 giờ',
}));
app.use('/api/auth', authRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);
// Error handling middleware
app.use((err, req, res) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    // Log error with more context
    logger.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });
    res.status(500).json({
        message: process.env.NODE_ENV === 'production'
            ? 'Có lỗi xảy ra!'
            : err.message,
        code: 'INTERNAL_SERVER_ERROR'
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Không tìm thấy route' });
});
// Connect to MongoDB and start server
mongoose
    .connect(MONGODB_URI)
    .then(() => {
    console.log('Kết nối MongoDB thành công');
    server.listen(PORT, () => {
        console.log(`Server chạy tại http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('Lỗi kết nối MongoDB:', err);
    process.exit(1);
});
export { io };
