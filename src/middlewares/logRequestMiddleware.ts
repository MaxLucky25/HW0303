import { Request, Response, NextFunction } from 'express';
import {RequestLogModel} from "../models/requestLogModel";


export const logRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logEntry = {
            ip: req.ip || '',
            url: req.originalUrl,
            date: new Date(),
        };

        await RequestLogModel.create(logEntry);
    } catch (err) {
        console.error('Logging error:', err);
    }
    next();
};
