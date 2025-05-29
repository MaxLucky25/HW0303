import { Request, Response, NextFunction } from 'express';
import config from "../utility/config";
import {RequestLogModel} from "../models/requestLogModel";
import {subSeconds} from "date-fns";



export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const url = req.originalUrl;

    const windowStart = subSeconds(new Date(), config.LIMIT_WINDOW_SECONDS);

    const requestsCount = await RequestLogModel.countDocuments({
        ip,
        url,
        date: { $gte: windowStart },
    });

    if (requestsCount > config.MAX_REQUESTS) {
        res.status(429).send('Too many requests');
        return;
    }

    next();
};
