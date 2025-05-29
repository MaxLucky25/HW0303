import {BcryptService} from "../utility/bcryptService";
import {UserRepository} from "../repositories/userRepository";
import {EmailService} from "../utility/emailService";
import {JwtService} from "../utility/jwtService";
import {SessionRepository} from "../repositories/sessionRepository";
import {inject, injectable} from "inversify";
import TYPES from "../di/types";
import {UserModel} from "../models/userModel";
import {toObjectId} from "../utility/toObjectId";


@injectable()
export class AuthService {
    constructor(
        @inject(TYPES.BcryptService) private bcryptService: BcryptService,
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
        @inject(TYPES.SessionRepository) private sessionRepository: SessionRepository,
        @inject(TYPES.EmailService) private emailService: EmailService,
        @inject(TYPES.JwtService) private jwtService: JwtService,
    ) {}
    async login(loginOrEmail: string, password: string,  ip: string, title: string):
        Promise<{ accessToken: string, refreshToken: string } | null> {

        const user = await UserModel.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
        });
        if (!user || !user.emailConfirmation.isConfirmed) return null;

        const isValid = await this.bcryptService.compareHash(password, user.password);
        if (!isValid) return null;


        const { deviceId, lastActiveDate } = await this.sessionRepository.createLoginSession(
            user.id,
            ip,
            title
        );

        return {
            accessToken: this.jwtService.createAccessToken({
                userId: user._id.toString(),
                login: user.login,
                email: user.email,
            }),
            refreshToken: this.jwtService.createRefreshToken({
                userId: user._id.toString(),
                deviceId,
                lastActiveDate,
            }),
        };
    }

    async refreshTokens(refreshToken: string, ip: string, title: string) {

        const payload = this.jwtService.verifyRefreshToken(refreshToken);
        if (!payload || !payload.userId || !payload.deviceId || !payload.lastActiveDate) return null;

        const session = await this.sessionRepository.findByDeviceId(payload.deviceId);
        if (!session || session.lastActiveDate !== payload.lastActiveDate) return null;

        const updated = await this.sessionRepository.updateSessionActivity(payload.deviceId, ip, title);
        if (!updated) return null;

        const user = await UserModel.findOne({ _id: toObjectId(payload.userId) });
        if (!user) return null;

        const newPayload = {
            userId: payload.userId,
            deviceId: payload.deviceId,
            lastActiveDate: updated.lastActiveDate
        };

        return {
            accessToken: this.jwtService.createAccessToken({
                userId: payload.userId,
                login: payload.userLogin,
                email: payload.userEmail,
            }),
            refreshToken: this.jwtService.createRefreshToken(newPayload)
        };
    }


    async register(login: string, password: string, email: string) {
        if (await this.userRepository.doesExistByLoginOrEmail(login, email)) {
            return null;
        }
        const hashedPassword = await this.bcryptService.generateHash(password);
        const user = await UserModel.createUser({
            login: login,
            password: hashedPassword,
            email: email,
            isConfirmed: false,
        });

        await this.emailService.sendRegistrationEmail(email, user.emailConfirmation.confirmationCode);

        return {
            userId: user._id.toString(),
            confirmationCode: user.emailConfirmation.confirmationCode
        };
    }

    async confirm(code: string): Promise<boolean> {
        const user = await UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
        if (!user || user.emailConfirmation.isConfirmed || user.emailConfirmation.expirationDate < new Date()) {
            return false;
        }

        return await this.userRepository.updateConfirmation(user.id, { isConfirmed: true });
    }

    async resendEmail(email: string): Promise<string | null> {
        const user = await UserModel.findOne({ email });
        if (!user || user.emailConfirmation.isConfirmed) return null;

        user.resetEmailConfirmation();
        const saved = await user.save();
        const sent = await this.emailService.sendRegistrationEmail(email, saved.emailConfirmation.confirmationCode);

        return sent ? saved.emailConfirmation.confirmationCode : null;
    }

    async sendPasswordRecoveryCode(email: string): Promise<boolean> {
        const user = await UserModel.findOne({ email });
        if (!user || !user.emailConfirmation.isConfirmed) return false;

        user.resetPasswordRecovery();
        await user.save();

        return await this.emailService.sendRecoveryEmail(email, user.passwordRecovery.recoveryCode);
    }

    async confirmNewPassword(newPassword: string, recoveryCode: string): Promise<boolean> {
        const user = await UserModel.findOne({ 'passwordRecovery.recoveryCode': recoveryCode });
        if (
            !user ||
            !user.passwordRecovery?.recoveryCode ||
            user.passwordRecovery.expirationDate < new Date()
        ) return false;

        const newHash = await this.bcryptService.generateHash(newPassword);

        return await this.userRepository.updatePassword(user.id, newHash);
    }
}