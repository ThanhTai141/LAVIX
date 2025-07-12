import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  clientMessageId?: string;
}

const messageSchema = new Schema<IMessage>({
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  clientMessageId: { type: String, required: false }
});

export default mongoose.model<IMessage>('Message', messageSchema); 