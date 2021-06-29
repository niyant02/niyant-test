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

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        verify(token, APP_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

export interface Token {
    userId: number;
}
