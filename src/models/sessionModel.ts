import {Model, model, Schema, Types} from "mongoose";
import { randomUUID } from "crypto";
import config from "../utility/config";
import {add} from "date-fns";


export type SessionDBType = {
    _id: Types.ObjectId;
    userId: string;
    deviceId: string;
    ip: string;
    title: string; // user-agent
    lastActiveDate: string;
    expiresDate: string;
};

interface ISessionModelStatics extends Model<SessionDBType> {
    createLoginSession(
        userId: string,
        ip: string,
        title: string
    ): Promise<{ deviceId: string; lastActiveDate: string }>;
}

interface ISessionModelStatics extends Model<SessionDBType> {
    createLoginSession(
        userId: string,
        ip: string,
        title: string
    ): Promise<{ deviceId: string; lastActiveDate: string }>;

    updateSessionActivity(
        deviceId: string,
        ip: string,
        title: string
    ): Promise<{ lastActiveDate: string } | null>;
}

const SessionSchema = new Schema<SessionDBType, ISessionModelStatics>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: String, required: true },
    expiresDate: { type: String, required: true },
});


SessionSchema.statics.createLoginSession = async function (
    this: Model<SessionDBType>,
    userId: string,
    ip: string,
    title: string
): Promise<{ deviceId: string; lastActiveDate: string }> {
    const deviceId = randomUUID();
    const lastActiveDate = new Date().toISOString();
    const expiresDate = add(new Date(), { seconds: config.JWT_REFRESH_EXPIRES_IN }).toISOString();


    await this.create({
        userId,
        deviceId,
        ip,
        title,
        lastActiveDate,
        expiresDate,
    });

    return { deviceId, lastActiveDate };
};

SessionSchema.statics.updateSessionActivity = async function (
    this: Model<SessionDBType>,
    deviceId: string,
    ip: string,
    title: string
): Promise<{ lastActiveDate: string } | null> {
    const lastActiveDate = new Date().toISOString();
    const expiresDate = add(new Date(), { seconds: config.JWT_REFRESH_EXPIRES_IN }).toISOString();

    const result = await this.updateOne(
        { deviceId },
        { $set: { lastActiveDate, expiresDate, ip, title } }
    );

    return result.modifiedCount === 1 ? { lastActiveDate } : null;
};


export const SessionModel = model<SessionDBType, ISessionModelStatics>("Session", SessionSchema);
