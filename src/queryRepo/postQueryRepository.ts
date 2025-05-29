import {PostModel, PostViewModel } from '../models/postModel';
import { getPaginationParams } from '../utility/commonPagination';
import {injectable} from "inversify";
import {toObjectId} from "../utility/toObjectId";

@injectable()
export class PostQueryRepository {

    async getById(id: string): Promise<PostViewModel | null> {
       const post = await PostModel.findOne({_id: toObjectId(id)});
       return post ? post.toViewModel() : null;
    }

    async getPosts(query: any): Promise<any> {
        const { pageNumber, pageSize, sortBy, sortDirection } = getPaginationParams(query);
        const filter = {};
        const totalCount = await PostModel.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);

        const itemsDocs = await PostModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)

        const items = itemsDocs.map((post) => post.toViewModel());

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: items,
        };
    }

    async getPostsByBlogId(blogId: string, query: any): Promise<any> {
        const { pageNumber, pageSize, sortBy, sortDirection } = getPaginationParams(query);
        const filter = { blogId: toObjectId(blogId) };
        const totalCount = await PostModel.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);
        const itemsDocs = await PostModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)


        const items = itemsDocs.map((post) => post.toViewModel());

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: items,
        };
    }
}
