import {isValidObjectId, Types} from "mongoose";

export const toObjectId = (id: string | Types.ObjectId): Types.ObjectId => {
    if (id instanceof Types.ObjectId) {
        return id;
    }

    if (!isValidObjectId(id)) {
        throw new Error(`Invalid Mongoose ObjectId: "${id}"`);
    }

    return new Types.ObjectId(id);
};