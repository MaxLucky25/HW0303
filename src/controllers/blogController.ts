import {inject, injectable} from "inversify";
import TYPES from "../di/types";
import {BlogService} from "../services/blogService";
import { Request, Response } from 'express';
import { BlogQueryRepository } from "../queryRepo/blogQueryRepository";
import { PostQueryRepository } from "../queryRepo/postQueryRepository";

@injectable()
export class BlogController {
    constructor(
        @inject(TYPES.BlogService)private blogService: BlogService,
        @inject(TYPES.BlogQueryRepository)private blogQueryRepository: BlogQueryRepository,
        @inject(TYPES.PostQueryRepository)private postQueryRepository: PostQueryRepository,
    ) {}

    getAllBlogs = async (req: Request, res: Response) => {
        const result = await this.blogQueryRepository.getBlogs(req.query);
        res.status(200).json(result);
    };

    getBlogById = async (req: Request, res: Response) => {
        const blog = await this.blogQueryRepository.getById(req.params.id);
        blog ? res.json(blog) : res.sendStatus(404);
    };

    createBlog =async (req: Request, res: Response) => {
        const newBlog = await this.blogService.createBlog(req.body);
        res.status(201).json(newBlog);
    };

    updateBlog = async (req: Request, res: Response) => {
        const updated = await this.blogService.updateBlog(req.params.id, req.body);
        updated ? res.sendStatus(204) : res.sendStatus(404);
    };

    deleteBlog = async (req: Request, res: Response) => {
        const deleted = await this.blogService.deleteBlog(req.params.id);
        deleted ? res.sendStatus(204) : res.sendStatus(404);
    };

    getPostsForBlog = async (req: Request, res: Response) => {
        const blog = await this.blogQueryRepository.getById(req.params.id);
        if (!blog) {
            res.sendStatus(404);
            return;
        }
        const result = await this.postQueryRepository.getPostsByBlogId(req.params.id, req.query);
        res.status(200).json(result);
    };

    createPostsForBlog = async (req: Request, res: Response) => {
        const blog = await this.blogQueryRepository.getById(req.params.id);
        if (!blog) {
            res.sendStatus(404);
            return;
        }
        const newPost = await this.blogService.createPostsForBlog(req.params.id, req.body);
        newPost ? res.status(201).json(newPost) : res.sendStatus(400);
    };


}