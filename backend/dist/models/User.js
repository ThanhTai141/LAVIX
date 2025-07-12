// src/models/User.ts
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.js';
const gameSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['AR', 'VR', 'AI', 'Normal'], required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    completed: { type: Boolean, default: false },
    stars: { type: Number, default: 0, min: 0, max: 3 },
    lastPlayed: { type: String },
});
const subjectSchema = new Schema({
    id: { type: String, required: true },
    name: {
        type: String,
        required: true,
        enum: [
            'Toán Học',
            'Vật Lý',
            'Hóa Học',
            'Sinh Học',
            'Lịch Sử',
            'Địa Lý',
            'Giải Phẫu',
            'Lập Trình Cơ Bản',
        ],
    },
    icon: { type: String, required: true },
    progress: { type: Number, required: true, min: 0, max: 100 },
    level: { type: Number, required: true, min: 1 },
    xp: { type: Number, required: true, min: 0 },
    color: { type: String, required: true },
    games: [gameSchema],
});
const badgeSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], required: true },
    unlockedAt: { type: String, required: true },
});
const activitySchema = new Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    xpGained: { type: Number, required: true },
    timestamp: { type: String, required: true },
    subject: { type: String, required: true },
});
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
        minlength: [8, 'Mật khẩu phải có ít nhất 8 ký tự'],
        select: false,
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        sparse: true,
        match: [/^[A-Za-z0-9_]{3,20}$/, 'Username chỉ được chứa chữ cái, số và dấu gạch dưới, từ 3 đến 20 ký tự'],
    },
    fullName: {
        type: String,
        required: [true, 'Họ tên là bắt buộc'],
        trim: true,
        match: [/^[A-Za-z\s]+$/, 'Họ tên chỉ được chứa chữ cái và khoảng trắng'],
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin', 'parent'],
        default: 'student',
    },
    avatar: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'active',
    },
    subscriptionPlan: {
        type: String,
        enum: ['basic', 'premium', 'family'],
        default: 'basic',
    },
    level: {
        type: Number,
        default: 1,
        min: 1,
    },
    xp: {
        type: Number,
        default: 0,
        min: 0,
    },
    nextLevelXp: {
        type: Number,
        default: 1000,
        min: 0,
    },
    coins: {
        type: Number,
        default: 0,
        min: 0,
    },
    streak: {
        type: Number,
        default: 0,
        min: 0,
    },
    badges: [badgeSchema],
    subjects: [subjectSchema],
    recentActivities: [activitySchema],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    progress: [
        {
            subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
            completion: { type: Number, default: 0, min: 0, max: 100 },
            lastAccessed: { type: Date },
        },
    ],
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    isOnline: {
        type: Boolean,
        default: false,
    },
    lastSeen: {
        type: Date,
        default: null,
    },
}, { timestamps: true });
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        logger.info('Password hashed successfully', { email: this.email });
        next();
    }
    catch (error) {
        logger.error('Error hashing password', { error, email: this.email });
        next(error);
    }
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        logger.info('Password comparison', { email: this.email, isMatch });
        return isMatch;
    }
    catch (error) {
        logger.error('Error comparing password', { error, email: this.email });
        throw error;
    }
};
// Chỉ giữ các index cần thiết
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ resetPasswordToken: 1 });
userSchema.index({ username: 1 }, { sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ subscriptionPlan: 1 });
userSchema.index({ level: 1 });
userSchema.index({ 'subjects.name': 1 });
userSchema.index({ createdAt: -1 });
const User = mongoose.model('User', userSchema);
export default User;
