import mongoose from 'mongoose';

const CommentLikeSchema = new mongoose.Schema({
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, enum: ['None', 'Like', 'Dislike'], required: true },
    addedAt: { type: Date, required: true }
});

CommentLikeSchema.index({ commentId: 1, userId: 1 }, { unique: true });

export const CommentLikeModel = mongoose.model('CommentLike', CommentLikeSchema);
