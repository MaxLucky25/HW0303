import { model, Schema, Document, Model, Types } from "mongoose";
import {toObjectId} from "../utility/toObjectId";
import {CommentLikeModel} from "./commentLikeModel";

export type CommentDBType = {
    _id: Types.ObjectId;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    postId: Types.ObjectId;
    createdAt: Date;
};

export type CommentViewModel = {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: Date;
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string;
    };
};

export type CommentDto = { content: string };

interface ICommentDocument extends Document<Types.ObjectId> {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    postId: Types.ObjectId;
    createdAt: Date;
    likesCount: number;
    dislikesCount: number;
    toViewModel(currentUserId?: string): CommentViewModel;
}

interface ICommentModelStatic extends Model<ICommentDocument> {
    createComment(input: {
        content: string;
        postId: string;
        commentatorInfo: { userId: string; userLogin: string };
    }): ICommentDocument;
    updateLikeCounters(commentId: string): Promise<void>;
}

const commentSchema = new Schema<ICommentDocument, ICommentModelStatic>({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    createdAt: { type: Date, required: true, default: Date.now},
    likesCount: { type: Number, required: true, default: 0 },
    dislikesCount: { type: Number, required: true, default: 0 }
});

commentSchema.statics.createComment = function(input: {
    content: string;
    postId: string;
    commentatorInfo: { userId: string; userLogin: string };
}): ICommentDocument {
    return new CommentModel({
        content: input.content,
        postId: toObjectId(input.postId),
        commentatorInfo: input.commentatorInfo,
    });
};

commentSchema.statics.updateLikeCounters = async function (commentId: string) {
    const likesCount = await CommentLikeModel.countDocuments({
        commentId,
        status: 'Like' });
    const dislikesCount = await CommentLikeModel.countDocuments({
        commentId,
        status: 'Dislike' });
    await this.findByIdAndUpdate(commentId, { likesCount, dislikesCount });
};

commentSchema.methods.toViewModel = async function(userId?: string): Promise <CommentViewModel> {
    const comment = this as ICommentDocument;
    const like = userId ? await CommentLikeModel.findOne
    ({ commentId: comment._id.toString(), userId }) : null;
    return {
        id: this._id.toString(),
        content: this.content,
        createdAt: this.createdAt,
        commentatorInfo: this.commentatorInfo,
        likesInfo: {
            likesCount: comment.likesCount,
            dislikesCount: comment.dislikesCount,
            myStatus: like?.status || 'None'
        }
    };
};

export const CommentModel = model<ICommentDocument, ICommentModelStatic >('Comment', commentSchema);