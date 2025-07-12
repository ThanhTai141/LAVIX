import mongoose, { Schema } from 'mongoose';
const messageSchema = new Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});
const chatHistorySchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    messages: [messageSchema],
    lastMessage: {
        type: String,
        required: true
    }
}, { timestamps: true });
// Index để tối ưu query
chatHistorySchema.index({ userId: 1, updatedAt: -1 });
const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
export default ChatHistory;
