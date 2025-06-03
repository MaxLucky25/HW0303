import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import TYPES from "../di/types";
import {CommentService} from "../services/commentService";
import {CommentQueryRepository} from "../queryRepo/commentQueryRepository";
import {LikeUpdateResult} from "../models/commentLikeModel";

@injectable()
export class CommentController {
    constructor(
        @inject(TYPES.CommentService) private commentService: CommentService,
        @inject(TYPES.CommentQueryRepository) private commentQueryRepository: CommentQueryRepository,
    ) {}

    updateComment = async (req: Request, res: Response) => {
        const { commentId } = req.params;
        const userId = req.userId!;
        const comment = await this.commentQueryRepository.getCommentById(commentId);
        if (!comment) {
            res.sendStatus(404);
            return;
        }
        if (comment.commentatorInfo.userId !== userId) {
            res.sendStatus(403);
            return;
        }
        const updated = await this.commentService.updateComment(commentId, { content: req.body.content });
        updated ? res.sendStatus(204) : res.sendStatus(400);
    }


    deleteComment = async (req: Request, res: Response) => {
        const { commentId } = req.params;
        const userId = req.userId!;
        const comment = await this.commentQueryRepository.getCommentById(commentId);
        if (!comment) {
            res.sendStatus(404);
            return;
        }
        if (comment.commentatorInfo.userId !== userId) {
            res.sendStatus(403);
            return;
        }
        const deleted = await this.commentService.deleteComment(commentId);
        deleted ? res.sendStatus(204) : res.sendStatus(404);
    }

    getCommentById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.userId || undefined;
        const comment = await this.commentQueryRepository.getCommentById(id, userId);
        if (comment) {
            res.status(200).json(comment);
        } else {
            res.sendStatus(404);
        }
    }

    updateLikeStatus = async (req: Request, res: Response)=> {
        const { commentId } = req.params;
        const userId = req.userId!;
        const { likeStatus } = req.body;

        const result = await this.commentService.updateLikeStatus(commentId, userId, likeStatus);

        if (result === LikeUpdateResult.NotFound) {
            res.sendStatus(404);
            return;
        }

        const updatedComment = await this.commentQueryRepository.getCommentById(commentId, userId);
        if (!updatedComment) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);
    };
}