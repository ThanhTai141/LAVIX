import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatHistory extends Document {
  userId: mongoose.Types.ObjectId;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  lastMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

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

const chatHistorySchema: Schema<IChatHistory> = new Schema(
  {
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
  },
  { timestamps: true }
);

// Index để tối ưu query
chatHistorySchema.index({ userId: 1, updatedAt: -1 });

const ChatHistory: Model<IChatHistory> = mongoose.model<IChatHistory>('ChatHistory', chatHistorySchema);
export default ChatHistory; 