import {model, Schema, Document, Model, Types} from "mongoose";
import { randomUUID } from "crypto";
import config from "../utility/config";
import {add} from "date-fns";

export type EmailConfirmationType = {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
};

export type PasswordRecoveryType = {
    recoveryCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
};

export type UserDBType = {
    _id: Types.ObjectId;
    login: string;
    password: string;
    email: string;
    createdAt: Date;
    emailConfirmation: EmailConfirmationType;
    passwordRecovery: PasswordRecoveryType;
};

export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: Date;
};

export type CreateUserDto = Pick<UserDBType, 'login' | 'password' | 'email'>;

interface IUserDocument extends Document<Types.ObjectId> {
    login: string;
    password: string;
    email: string;
    createdAt: Date;
    emailConfirmation: EmailConfirmationType;
    passwordRecovery: PasswordRecoveryType;
    toViewModel(): UserViewModel;
    resetPasswordRecovery(): void;
    resetEmailConfirmation(): void;
}

interface IUserModelStatic extends Model<IUserDocument> {
    createUser(data: {
        login: string;
        password: string;
        email: string;
        isConfirmed?: boolean;
    }): Promise<IUserDocument>;
}

const EmailConfirmationSchema = new Schema<EmailConfirmationType>({
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
}, { _id: false });

const PasswordRecoverySchema = new Schema<PasswordRecoveryType>({
    recoveryCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
}, { _id: false });

const UserSchema = new Schema<IUserDocument>({
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true },
    emailConfirmation: { type: EmailConfirmationSchema, required: true },
    passwordRecovery: { type: PasswordRecoverySchema, required: true },
});

UserSchema.methods.toViewModel = function (): UserViewModel {
    return {
        id: this._id.toString(),
        login: this.login,
        email: this.email,
        createdAt: this.createdAt
    };
};
UserSchema.methods.resetPasswordRecovery = function (): void {
    this.passwordRecovery = {
        recoveryCode: randomUUID(),
        expirationDate: add(new Date(), { minutes: config.PASSWORD_RECOVERY_EXPIRATION }),
        isConfirmed: false
    };
};

UserSchema.methods.resetEmailConfirmation = function (): void {
    this.emailConfirmation = {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { minutes: config.EMAIL_CONFIRMATION_EXPIRATION }),
        isConfirmed: false
    };
};


UserSchema.statics.createUser = function ({login, password, email, isConfirmed = false
}): Promise<IUserDocument> {
    const user = new this({
        login,
        email,
        password,
        createdAt: new Date(),
        emailConfirmation: {
            confirmationCode: randomUUID(),
            expirationDate: add(new Date(), { minutes: config.EMAIL_CONFIRMATION_EXPIRATION}),
            isConfirmed
        },
        passwordRecovery: {
            recoveryCode: randomUUID(),
            expirationDate: add(new Date(), { minutes: config.PASSWORD_RECOVERY_EXPIRATION }),
            isConfirmed: false
        }
    });
    return user.save();
};

export const UserModel = model<IUserDocument, IUserModelStatic>('User', UserSchema);
