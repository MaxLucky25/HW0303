import {Router} from "express";
import { inputCheckErrorsMiddleware } from "../middlewares/inputCheckErrorMiddleware";
import { authJwtMiddleware } from "../middlewares/authJwtMiddleware";
import {
    confirmationValidators,
    emailResendingValidators,
    loginValidator,
    newPasswordValidator,
    recoveryEmailValidator,
    registrationValidators
} from "../validators/authValidators";
import {rateLimitMiddleware} from "../middlewares/rateLimitMiddleware";
import container from "../di/iosContaner";
import TYPES from "../di/types";
import { AuthController } from "../controllers/authController";
import { authRefreshTokenMiddleware } from "../middlewares/authRefreshTokenMiddleware";



const controller = container.get<AuthController>(TYPES.AuthController);
export const authRouter = Router();



authRouter.post('/login',
    rateLimitMiddleware,
    loginValidator,
    inputCheckErrorsMiddleware,
    controller.login
);

authRouter.post('/refresh-token',
    rateLimitMiddleware,
    authRefreshTokenMiddleware,
    controller.refreshTokens
);


authRouter.post('/logout',
    rateLimitMiddleware,
    authRefreshTokenMiddleware,
    controller.logout
);

authRouter.get('/me',
    rateLimitMiddleware,
    authJwtMiddleware,
    controller.getMe
);

authRouter.post('/registration',
    rateLimitMiddleware,
    registrationValidators,
    inputCheckErrorsMiddleware,
    controller.register
);

authRouter.post('/registration-confirmation',
    rateLimitMiddleware,
    confirmationValidators,
    inputCheckErrorsMiddleware,
    controller.confirm
);

authRouter.post('/registration-email-resending',
    rateLimitMiddleware,
    emailResendingValidators,
    inputCheckErrorsMiddleware,
    controller.resendEmail
);

authRouter.post('/password-recovery',
    rateLimitMiddleware,
    recoveryEmailValidator,
    inputCheckErrorsMiddleware,
    controller.sendRecoveryCode
);

authRouter.post('/new-password',
    rateLimitMiddleware,
    newPasswordValidator,
    inputCheckErrorsMiddleware,
    controller.setNewPassword
);

