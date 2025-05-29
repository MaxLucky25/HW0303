import{Request, Response} from "express";
import {inject, injectable} from "inversify";
import {SessionRepository} from "../repositories/sessionRepository";
import TYPES from "../di/types";
import {JwtService} from "../utility/jwtService";


@injectable()
export class SecurityController {
    constructor(
        @inject(TYPES.SessionRepository) private sessionRepository: SessionRepository,
        @inject(TYPES.JwtService) private jwtService: JwtService,
    ) {}


    deleteByDeviceId = async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(401);
            return;
        }

        const payload = this.jwtService.verifyRefreshToken(refreshToken);
        if (!payload || !payload.userId || !payload.deviceId) {
            res.sendStatus(401);
            return;
        }

        const session = await this.sessionRepository.findByDeviceId(req.params.deviceId);
        if (!session){
            res.sendStatus(404);
            return;
        }
        if (session.userId !== payload.userId) {
            res.sendStatus(403);
            return;
        }

        await this.sessionRepository.deleteByDeviceId(req.params.deviceId);
        res.sendStatus(204);
    }

    deleteAllExcept = async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken){
            res.sendStatus(401);
            return;
        }

        const payload = this.jwtService.verifyRefreshToken(refreshToken);
        if (!payload || !payload.userId || !payload.deviceId) {
            res.sendStatus(401);
            return;
        }


        await this.sessionRepository.deleteAllExcept(payload.deviceId, payload.userId);
        res.sendStatus(204);
    }

    findAllByUser = async (req: Request, res: Response) => {
        const userId = req.userId;
        if (!userId) {
            res.sendStatus(401);
            return;
        }
        const sessions = await this.sessionRepository.findAllByUser(userId);

        const mapped = sessions.map(s => ({
            ip: s.ip,
            title: s.title,
            lastActiveDate: s.lastActiveDate,
            deviceId: s.deviceId,
        }));

        res.status(200).json(mapped);
    }

}