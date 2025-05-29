import {injectable} from "inversify";
import { BlogDto, BlogModel, BlogViewModel } from "../models/blogModel";
import {toObjectId} from "../utility/toObjectId";


@injectable()
export class BlogRepository  {

    async create(input: BlogDto): Promise<BlogViewModel> {
        const newBlog = await BlogModel.createBlog({
            name: input.name,
            description: input.description,
            websiteUrl: input.websiteUrl,
        });

        return newBlog.toViewModel();

    }

    async update(id: string, input: BlogDto): Promise<boolean> {
        const blog = await BlogModel.findOne({ _id: toObjectId(id) });
        if (!blog) return false;

        blog.name = input.name;
        blog.description = input.description;
        blog.websiteUrl = input.websiteUrl;

        await blog.save();
        return true;
    }

    async delete(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({ _id: toObjectId(id) });
        return result.deletedCount === 1;
    }

}