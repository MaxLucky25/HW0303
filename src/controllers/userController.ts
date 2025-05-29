import { Request, Response } from 'express';
import {inject, injectable} from "inversify";
import TYPES from "../di/types";
import {UserService} from "../services/userService";
import {UserQueryRepository} from "../queryRepo/userQueryRepository";


@injectable()
export class UserController {
    constructor(
        @inject(TYPES.UserService) private userService: UserService,
        @inject(TYPES.UserQueryRepository)private userQueryRepository: UserQueryRepository,
    ) {}

    getUsers = async (req:Request, res: Response) => {
        const result = await this.userQueryRepository.getUsers(req.query);
        res.status(200).json(result);
    };

    createUserByAdmin = async (req: Request, res: Response) => {
        const result = await this.userService.createUserByAdmin(req.body);
        if (!result) {
            res.status(400);
            return;
        }
        res.status(201).json(result);
        return;
    }

    deleteUser = async (req:Request, res:Response) => {
        const deleted = await this.userService.deleteUser(req.params.id);
        deleted ? res.sendStatus(204) : res.sendStatus(404);
    };
}