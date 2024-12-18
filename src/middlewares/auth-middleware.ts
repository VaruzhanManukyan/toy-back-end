import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import ApiError from "../exceptions/api-error";
import tokenService from "../services/token-service";

interface IUser {
    id: string;
}

const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (error: Error | null, user: IUser | false) => {
        const authHeader: string | undefined = request.headers.authorization;
        const refreshToken: string | undefined = request.cookies?.refreshToken;

        if (!(authHeader && refreshToken)) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        request.user = userData;
        next();
    })(request, response, next);
};

export default authMiddleware;
