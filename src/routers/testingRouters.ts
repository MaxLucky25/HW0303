import { Router } from 'express';
import { BlogModel } from '../models/blogModel';
import {CommentModel} from "../models/commentModel";
import { PostModel } from '../models/postModel';
import {RequestLogModel} from "../models/requestLogModel";
import {SessionModel} from "../models/sessionModel";
import { UserModel } from '../models/userModel';


export const testingRouters = Router();

testingRouters.delete('/all-data', async (req, res) => {
    await BlogModel.deleteMany({});
    await PostModel.deleteMany({});
    await UserModel.deleteMany({});
    await CommentModel.deleteMany({});
    await RequestLogModel.deleteMany({});
    await SessionModel.deleteMany({});
    res.sendStatus(204);
});

