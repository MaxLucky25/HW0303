import {Router} from "express";
import {authBasicMiddleware} from "../middlewares/authBasicMiddleware";
import {userValidators} from "../validators/userValidators";
import { inputCheckErrorsMiddleware } from "../middlewares/inputCheckErrorMiddleware";
import TYPES from "../di/types";
import { UserController } from "../controllers/userController";
import container from "../di/iosContaner";

const controller = container.get<UserController>(TYPES.UserController);
export const userRouter = Router();

userRouter.get('/',
    authBasicMiddleware,
    controller.getUsers
    );

userRouter.post('/',
    authBasicMiddleware,
    userValidators,
    inputCheckErrorsMiddleware,
    controller.createUserByAdmin
);

userRouter.delete('/:id',
    authBasicMiddleware,
    controller.deleteUser
);

