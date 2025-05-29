import { injectable } from "inversify";
import {SessionDBType, SessionModel} from "../models/sessionModel";
import { DeleteResult } from "mongoose";


@injectable()
export class SessionRepository  {
    async createLoginSession(userId: string, ip: string, title: string): Promise<{ deviceId: string; lastActiveDate: string }> {
        return await SessionModel.createLoginSession(userId, ip, title);
    }

    async updateSessionActivity(deviceId: string, ip: string, title: string): Promise<{ lastActiveDate: string } | null> {
        return SessionModel.updateSessionActivity(deviceId, ip, title);
    }

    async deleteByDeviceId(deviceId: string): Promise<DeleteResult> {
        return SessionModel.deleteOne({ deviceId });
    }

    async deleteAllExcept(deviceId: string, userId: string): Promise<DeleteResult> {
        return SessionModel.deleteMany({ deviceId: { $ne: deviceId }, userId });
    }

    async findAllByUser(userId: string): Promise<SessionDBType[]> {
        return SessionModel.find({ userId }).lean();
    }

    async findByDeviceId(deviceId: string): Promise<SessionDBType | null> {
        return SessionModel.findOne({ deviceId }).lean();
    }
}