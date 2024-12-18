import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import ApiError from '../exceptions/api-error';

interface IUserRole {
    role: string
}

function roleMiddleware(roles: string[]) {
    return (request: Request, response: Response, next: NextFunction) => {
        passport.authenticate('jwt', { session: false }, (error: Error | null, user: IUserRole | false) => {
        if (error) {
            return next(error);
        }

        if (!user) {
            return next(ApiError.UnauthorizedError());
        }

        if (!roles.includes(user.role)) {
            return next(ApiError.ForbiddenError());
        }

        request.user = user;
        next();
    })(request, response, next);
    };
}

export default roleMiddleware;
