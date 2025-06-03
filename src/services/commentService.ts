import {CommentRepository} from "../repositories/commentRepository";
import {CommentDto, CommentModel, CommentViewModel} from "../models/commentModel";
import {inject, injectable} from "inversify";
import TYPES from "../di/types";
import {PostModel} from "../models/postModel";
import {toObjectId} from "../utility/toObjectId";
import {CommentLikeModel, LikeStatus, LikeUpdateResult} from "../models/commentLikeModel";

@injectable()
export class CommentService  {
    constructor(
        @inject(TYPES.CommentRepository) private commentRepository: CommentRepository,
    ) {}

    async createComment(postId: string, input: CommentDto, commentatorInfo: {
        userId: string;
        userLogin: string
    }): Promise<CommentViewModel | null> {
        const post = await PostModel.findOne({_id: toObjectId(postId)});
        if (!post) return null;

        return await this.commentRepository.create(postId, input, commentatorInfo);
    }

    async updateComment(commentId: string, input: CommentDto): Promise<boolean> {
        return await this.commentRepository.update(commentId, input);
    }

    async deleteComment(commentId: string): Promise<boolean> {
        return await this.commentRepository.delete(commentId);
    }

    async updateLikeStatus(commentId: string, userId: string, likeStatus:LikeStatus): Promise<LikeUpdateResult> {
        const comment = await CommentModel.findById(commentId);
        if (!comment) return LikeUpdateResult.NotFound;

        const existing = await CommentLikeModel.findOne({ commentId: comment._id.toString(), userId });
        if (existing && existing.status === likeStatus) return LikeUpdateResult.NoChange;

        if (existing) {
            if (likeStatus === LikeStatus.None) {
                await existing.deleteOne();
            } else {
                existing.status = likeStatus;
                existing.addedAt = new Date();
                await existing.save();
            }
        } else if (likeStatus !== LikeStatus.None) {
            await CommentLikeModel.create({ 
                commentId: comment._id.toString(), 
                userId, 
                status: likeStatus, 
                addedAt: new Date() 
            });
        }

        await CommentModel.updateLikeCounters(comment._id.toString());
        return LikeUpdateResult.Updated;
    }

}
