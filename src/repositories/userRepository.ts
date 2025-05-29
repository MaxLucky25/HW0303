import {inject, injectable} from 'inversify';
import {CreateUserDto, UserModel} from "../models/userModel";
import TYPES from "../di/types";
import { BcryptService } from '../utility/bcryptService';
import {toObjectId} from "../utility/toObjectId";
import {isValidObjectId} from "mongoose";


@injectable()
export class UserRepository {
    constructor(
        @inject(TYPES.BcryptService) private bcryptService: BcryptService
    ) {}

    async doesExistByLoginOrEmail(login: string, email: string): Promise<boolean> {
        const count = await UserModel.countDocuments({ $or: [{ login }, { email }] });
        return count > 0;
    }

    async createUserByAdmin(dto: CreateUserDto) {
        const exists = await this.doesExistByLoginOrEmail(dto.login, dto.email);
        if (exists) return null;

        const hashedPassword = await this.bcryptService.generateHash(dto.password);
        const user = await UserModel.createUser({
            login: dto.login,
            password: hashedPassword,
            email: dto.email,
            isConfirmed: true
        });

        return user.toViewModel();
    }



    async updateConfirmation(idOrEmail: string, update: any): Promise<boolean> {
        const query: any = { $or: [{ email: idOrEmail }] };
        if (isValidObjectId(idOrEmail)) {
            query.$or.push({ _id: toObjectId(idOrEmail) });
        }
        const user = await UserModel.findOne(query);
        if (!user) return false;

        if (update.confirmationCode !== undefined) {
            user.emailConfirmation.confirmationCode = update.confirmationCode;
        }
        if (update.expirationDate !== undefined) {
            user.emailConfirmation.expirationDate = update.expirationDate;
        }
        if (update.isConfirmed !== undefined) {
            user.emailConfirmation.isConfirmed = update.isConfirmed;
        }

        await user.save();
        return true;
    }


    async updatePassword(userId: string, newHashedPassword: string): Promise<boolean> {
        const user = await UserModel.findOne({_id: toObjectId(userId)});
        if (!user) return false;
        user.password = newHashedPassword;
        user.resetPasswordRecovery();
        await user.save();
        return true;
    }


    async delete(id: string): Promise<boolean> {
        const result = await UserModel.deleteOne({ _id: toObjectId(id) });
        return result.deletedCount === 1;
    }
}
