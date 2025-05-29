import { injectable } from 'inversify';
import { getPaginationParams } from '../utility/commonPagination';
import {BlogModel, BlogViewModel } from '../models/blogModel';
import {toObjectId} from "../utility/toObjectId";

@injectable()
export class BlogQueryRepository {

    async getById(id: string): Promise<BlogViewModel | null> {
        try {
            const blog = await BlogModel.findOne({ _id: toObjectId(id) });
            return blog ? blog.toViewModel() : null;
        } catch {
            return null;
        }
    }


    async getBlogs(query: any): Promise<any> {

        const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = getPaginationParams(query);

        const filter = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};

        const totalCount = await BlogModel.countDocuments(filter);

        const pagesCount = Math.ceil(totalCount / pageSize);

        const blogDocs = await BlogModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)

        const items = blogDocs.map(blog => blog.toViewModel());

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items,
        };
    }
}
