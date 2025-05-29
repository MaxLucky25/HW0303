
// добавили новые значения и свойства в глобальную области видимости
declare global {
    namespace Express {
        export interface Request {
            userId?: string | null;
            deviceId?: string ;
            userLogin?: string;
            userEmail?: string;
            refreshToken?: string;
        }
    }
}
export {};