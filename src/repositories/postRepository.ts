import {PostDto, PostModel, PostViewModel} from '../models/postModel';
import {injectable} from "inversify";
import {BlogModel} from "../models/blogModel";
import {toObjectId} from "../utility/toObjectId";

@injectable()
export class PostRepository {
    async create(input:PostDto): Promise<PostViewModel | null> {
        const blog = await BlogModel.findOne({_id: toObjectId(input.blogId)});
        if (!blog) return null;

        const newPost = await PostModel.createPost ({
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: input.blogId,
            blogName: blog.name,
        });

        return newPost.toViewModel();
    }

    async update(id: string, input:PostDto): Promise<boolean> {
        const post = await PostModel.findOne({_id: toObjectId(id)});
        if (!post) return false;
        const blog = await BlogModel.findOne({_id: toObjectId(input.blogId)});
        if (!blog) return false;

        post.title = input.title;
        post.shortDescription = input.shortDescription;
        post.content = input.content;
        post.blogId = toObjectId(input.blogId);
        post.blogName = blog.name;

        await post.save();
        return true;
    }

    async delete(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: toObjectId(id)});
        return result.deletedCount === 1;
    }
}