import bcrypt from 'bcryptjs';
import {injectable} from "inversify";

@injectable()
export class BcryptService  {
    async generateHash(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }
    async compareHash(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}
