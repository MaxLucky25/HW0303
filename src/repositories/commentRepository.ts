import {CommentViewModel, CommentDto, CommentModel } from '../models/commentModel';
import {injectable} from "inversify";
import {toObjectId} from "../utility/toObjectId";


@injectable()
export class CommentRepository  {
    async create(postId: string,
                 input: CommentDto,
                 commentatorInfo: { userId: string; userLogin: string }
    ): Promise<CommentViewModel> {
        const comment = CommentModel.createComment({
            content: input.content,
            postId,
            commentatorInfo,
        });

        await comment.save();
        return comment.toViewModel();
    }

    async update(id: string, input: CommentDto): Promise<boolean> {
        const comment = await CommentModel.findOne({_id: toObjectId(id)});
        if (!comment) return false;

        comment.content = input.content;
        await comment.save();
        return true;
    }

    async delete(id: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({ _id: toObjectId(id) });
        return result.deletedCount === 1;
    }

}
