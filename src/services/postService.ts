import {PostRepository} from "../repositories/postRepository";
import {PostDto} from "../models/postModel";
import {inject, injectable} from "inversify";
import TYPES from "../di/types";

@injectable()
export class PostService {
    constructor(
        @inject(TYPES.PostRepository) private postRepository: PostRepository,
    ) {}

    async createPost(input: PostDto) {
        return await this.postRepository.create(input);
    }

    async updatePost(id:string, input:PostDto) {
        return await this.postRepository.update(id, input);
    }

    async deletePost(id:string) {
        return await this.postRepository.delete(id);
    }
}