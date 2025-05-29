import {BlogRepository} from "../repositories/blogRepository";
import {inputPostDto, PostDto} from "../models/postModel";
import {PostRepository} from "../repositories/postRepository";
import {inject, injectable} from "inversify";
import TYPES from "../di/types";
import {BlogDto} from "../models/blogModel";
import {BlogModel} from "../models/blogModel";
import {toObjectId} from "../utility/toObjectId";


@injectable()
export class BlogService  {
    constructor(
        @inject(TYPES.BlogRepository) private blogRepository: BlogRepository,
        @inject(TYPES.PostRepository) private postRepository: PostRepository,
    ) {}


    async createBlog(input: BlogDto){
        return await this.blogRepository.create(input);
    }

    async updateBlog(id: string, input: BlogDto){
        return await this.blogRepository.update(id, input);
    }

    async deleteBlog(id: string){
        return await this.blogRepository.delete(id);
    }

    async createPostsForBlog(
        blogId: string, input: inputPostDto){
        try {
            const blog = await BlogModel.findOne({_id: toObjectId(blogId)});
            if (!blog) return null;
            const postInput: PostDto = {...input, blogId};
            return await this.postRepository.create(postInput);
        } catch {
            return null;
        }
    }
}