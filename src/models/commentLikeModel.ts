import mongoose from 'mongoose';

export enum LikeUpdateResult {
    Updated = 'Updated',
    NoChange = 'NoChange',
    NotFound = 'NotFound'
}

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

const CommentLikeSchema = new mongoose.Schema({
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, enum: LikeStatus, required: true },
    addedAt: { type: Date, required: true }
});

CommentLikeSchema.index({ commentId: 1, userId: 1 }, { unique: true });

export const CommentLikeModel = mongoose.model('CommentLike', CommentLikeSchema);
