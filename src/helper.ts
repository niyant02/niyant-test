import { verify } from 'jsonwebtoken';

const { JWT_SECRET } = process.env;
export const APP_SECRET = JWT_SECRET || 'mydevsecret';

export const getAuthUser = (req) => {
    const Authorization = req.get('Authorization');
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const verifiedToken = verify(token, APP_SECRET) as Token;
        return verifiedToken && verifiedToken.userId;
    }
};

export interface Token {
    userId: number;
}
