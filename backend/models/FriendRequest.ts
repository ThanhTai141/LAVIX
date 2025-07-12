import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFriendRequest extends Document {
  from: Types.ObjectId;
  to: Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: Date;
}

const friendRequestSchema = new Schema<IFriendRequest>({
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IFriendRequest>('FriendRequest', friendRequestSchema); 