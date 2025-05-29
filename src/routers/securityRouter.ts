import { Router} from "express";
import {SecurityController} from "../controllers/securityController";
import container from "../di/iosContaner";
import TYPES from "../di/types";
import {authRefreshTokenMiddleware} from "../middlewares/authRefreshTokenMiddleware";

const controller = container.get<SecurityController>(TYPES.SecurityController)
export const securityRouter = Router();

securityRouter.get("/devices",
    authRefreshTokenMiddleware,
    controller.findAllByUser
);

securityRouter.delete("/devices",
    authRefreshTokenMiddleware,
    controller.deleteAllExcept
);

securityRouter.delete("/devices/:deviceId",
    authRefreshTokenMiddleware,
    controller.deleteByDeviceId
);
