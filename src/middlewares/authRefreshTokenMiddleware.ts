import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../utility/config';
import {SessionModel} from "../models/sessionModel";


export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            res.sendStatus(401);
            return;
        }

        try {
            const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as JwtPayload;

            const session = await SessionModel.findOne({deviceId :decoded.deviceId});
            if (!session || session.lastActiveDate !== decoded.lastActiveDate) {
                res.sendStatus(401);
                return;
            }

            // Добавим все поля как и в authJwtMiddleware
            req.userId = decoded.userId;
            req.deviceId = decoded.deviceId;
            req.refreshToken = refreshToken;

            next();
        } catch (e) {
            res.sendStatus(401);
            return;
        }

    };

