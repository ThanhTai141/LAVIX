import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = async (req, res, next) => {
    let token;
    // Lấy token từ cookie
    token = req.cookies.jwt;
    if (!token) {
        res.status(401).json({ message: 'Không có token, vui lòng đăng nhập' });
        return;
    }
    try {
        // Xác minh token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({ message: 'Người dùng không tồn tại' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Token không hợp lệ';
        res.status(401).json({ message });
    }
};
