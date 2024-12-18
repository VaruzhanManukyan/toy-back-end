import {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {Roles} from "../shared/enums/role-enum";
import {IUserDB} from "../shared/interfaces/user-interfaces";
import userService from "../services/user-service";
import tokenService from "../services/token-service";
import authService from "../services/auth-service";

class AuthController {
    async registration(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {email, password, role} = request.body;

            if (role === Roles.SUPER_ADMIN || !Object.values(Roles).includes(role)) {
                return next(ApiError.BadRequest(`User with role ${role} cannot be created`));
            }

            const user: IUserDB = await authService.registration(email, password, role);
            const tokens = tokenService.generateTokens(user);
            await tokenService.saveToken(user._id, tokens.refreshToken);

            response.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/"
            });
            response.status(201).json({accessToken: tokens.accessToken});
        } catch (error) {
            next(error);
        }
    }

    async login(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {email, password} = request.body;
            const userDB: IUserDB = await authService.login(email, password);

            const tokens = tokenService.generateTokens(userDB);
            await tokenService.saveToken(userDB._id, tokens.refreshToken);

            response.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/"
            });
            response.status(200).json({accessToken: tokens.accessToken});
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const refreshToken = request.cookies.refreshToken;
            if (!refreshToken) {
                throw ApiError.UnauthorizedError();
            }

            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = await tokenService.findToken(refreshToken);

            if (!userData || !tokenFromDb) {
                throw ApiError.UnauthorizedError();
            }

            const user_id = new Types.ObjectId(userData.id);
            const userDB: IUserDB = await userService.getById(user_id);
            const tokens = tokenService.generateTokens(userDB);
            await tokenService.saveToken(user_id, tokens.refreshToken);

            response.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/"
            });

            response.json({accessToken: tokens.accessToken});
        } catch (error) {
            next(error);
        }
    }

    async logout(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const refreshToken = request.cookies.refreshToken;
            await tokenService.removeToken(refreshToken);

            response.clearCookie('refreshToken');
            response.status(200).json({message: "Logout successful"});
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();