import {injectable} from "inversify";
import {CommentModel, CommentViewModel} from "../models/commentModel";
import {getPaginationParams} from "../utility/commonPagination";
import {toObjectId} from "../utility/toObjectId";


@injectable()
export class CommentQueryRepository{
    async getCommentById(id: string): Promise<CommentViewModel | null> {
        const comment = await CommentModel.findOne({ _id: toObjectId(id) }).exec();
        return comment ? comment.toViewModel() : null;
    }

    async getCommentsByPostId(postId: string, query: any): Promise<any> {
        const { pageNumber, pageSize, sortBy, sortDirection } = getPaginationParams(query);

        const filter = { postId: toObjectId(postId) };
        const totalCount = await CommentModel.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);

        const itemsDoc = await CommentModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();

        const items = await Promise.all(itemsDoc.map(c=>c.toViewModel()));
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: items
        };
    }
}