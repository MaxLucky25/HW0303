import {UserRepository} from '../repositories/userRepository';
import {CreateUserDto} from '../models/userModel';
import {inject, injectable } from 'inversify';
import TYPES from '../di/types';

@injectable()
export class UserService  {
    constructor(
       @inject(TYPES.UserRepository)private userRepository: UserRepository,
    ) {}

    async deleteUser(id: string): Promise<boolean> {
        return await this.userRepository.delete(id);
    }

    async createUserByAdmin(dto: CreateUserDto) {
        return await this.userRepository.createUserByAdmin(dto)
    }
}