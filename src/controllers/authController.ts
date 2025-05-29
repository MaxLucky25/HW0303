import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {AuthService} from "../services/authService";
import TYPES from "../di/types";
import {JwtService} from "../utility/jwtService";
import {SessionRepository} from "../repositories/sessionRepository";
import {UserQueryRepository} from "../queryRepo/userQueryRepository";


@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.AuthService) private  authService: AuthService,
        @inject(TYPES.JwtService) private jwtService: JwtService,
        @inject(TYPES.UserQueryRepository) private userQueryRepository: UserQueryRepository,
        @inject(TYPES.SessionRepository) private sessionRepository: SessionRepository,
    ) {}

    login = async (req: Request, res: Response) => {
        const { loginOrEmail, password } = req.body;
        const ip: string = req.ip ?? 'unknown-ip';
        const title: string = req.get('User-Agent') ?? 'Unknown device';
        const tokens = await this.authService.login(loginOrEmail, password, ip, title);

        if (!tokens) {
            res.sendStatus(401);
            return;
        }

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        res.status(200).json({ accessToken: tokens.accessToken });
    }

    refreshTokens = async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken){
            res.sendStatus(401);
            return;
        }
        const ip: string = req.ip ?? 'unknown-ip';
        const title: string = req.get('User-Agent') ?? 'Unknown device';

        const tokens = await this.authService.refreshTokens(refreshToken, ip, title);
        if (!tokens) {
            res.sendStatus(401);
            return;
        }

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        res.status(200).json({ accessToken: tokens.accessToken });
    }

    register = async (req: Request, res: Response) => {
        const { login, password, email } = req.body;

        const result = await this.authService.register(login, password, email);
        if (!result) {
            res.status(400);
            return;
        }
        res.sendStatus(204);
        return;
    }

    confirm = async (req: Request, res: Response) => {
        const confirmed = await this.authService.confirm(req.body.code);
        if (!confirmed) {
            res.status(400);
            return;
        }
        res.sendStatus(204);
    }

    resendEmail = async (req: Request, res: Response) => {
        const code = await this.authService.resendEmail(req.body.email);
        if (!code) {
            res.status(400);
            return;
        }
        res.sendStatus(204);
    }

    logout = async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(401);
            return;
        }

        const payload = this.jwtService.verifyRefreshToken(refreshToken);
        if (!payload || !payload.deviceId) {
            res.sendStatus(401);
            return;
        }

        const session = await this.sessionRepository.findByDeviceId(payload.deviceId);
        if (!session) {
            res.sendStatus(401);
            return;
        }

        await this.sessionRepository.deleteByDeviceId(payload.deviceId);
        res.clearCookie('refreshToken');
        res.sendStatus(204);
    }

    getMe = async (req: Request, res: Response) => {
        const userId = req.userId!;
        const user = await this.userQueryRepository.getById(userId);
        if (!user){
            res.sendStatus(401);
            return;
        }

        res.status(200).send({
            email: user.email,
            login: user.login,
            userId: user._id.toString(),
        });
    }

    sendRecoveryCode = async (req: Request, res: Response) => {
        await this.authService.sendPasswordRecoveryCode(req.body.email);
        res.sendStatus(204);
        return;
    }

    setNewPassword = async (req: Request, res: Response) => {
        const { newPassword, recoveryCode } = req.body;
        const success = await this.authService.confirmNewPassword(newPassword, recoveryCode);
        if (!success) {
            res.sendStatus(400)
            return;
        }
        res.sendStatus(204);
    }

}
