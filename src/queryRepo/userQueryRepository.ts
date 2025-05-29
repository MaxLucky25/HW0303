import {getUsersPaginationParams} from "../utility/userPagination";
import {injectable} from "inversify";
import {UserModel} from "../models/userModel";
import {toObjectId} from "../utility/toObjectId";

@injectable()
export class UserQueryRepository  {
    async getById(id: string) {
        return  UserModel.findOne({_id: toObjectId(id) });
    }

    async getByEmail(email: string) {
        return  UserModel.findOne({ email });
    }

    async getUsers(query: any): Promise<any>{
        const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} =
            getUsersPaginationParams(query);

    const filter: any = {};
    const orConditions: any[] = [];
        if (searchLoginTerm) {
            orConditions.push({ login: { $regex: searchLoginTerm, $options: "i" } });
        }
        if (searchEmailTerm) {
            orConditions.push({ email: { $regex: searchEmailTerm, $options: "i" } });
        }
        if (orConditions.length > 0) {
            filter.$or = orConditions;
        }
        const totalCount = await UserModel.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);

        const items = await UserModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: items.map(u => u.toViewModel()),
        };
    }
}