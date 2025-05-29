import jwt, { JwtPayload } from 'jsonwebtoken';
import config from './config';
import {injectable} from "inversify";


@injectable()
export class JwtService  {
    createAccessToken(payload: { userId: string, login: string; email: string  }) {
        return jwt.sign(payload,
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }as jwt.SignOptions
        );
    }

    createRefreshToken(payload: {
        userId: string;
        deviceId: string;
        lastActiveDate: string;
    }){
        return jwt.sign(payload,
            config.JWT_REFRESH_SECRET,
            { expiresIn: config.JWT_REFRESH_EXPIRES_IN }as jwt.SignOptions
        );
    }


    verifyRefreshToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, config.JWT_REFRESH_SECRET) as JwtPayload;
        } catch {
            return null;
        }
    }

}
