import argon2 from "argon2";
import ApiError from "../exceptions/api-error";
import {IUserDB} from "../shared/interfaces/user-interfaces";
import UserModel from "../models/user-model";
import tokenService from "./token-service";

class AuthService {
    async registration(email: string, password: string, role: string): Promise<IUserDB> {
        const existingUser: IUserDB | null = await UserModel.findOne({email});
        if (existingUser) {
            throw ApiError.BadRequest(`User with email ${email} already exists`);
        }

        const hashedPassword = await argon2.hash(password);
        const userDB: IUserDB = await UserModel.create({email, password: hashedPassword, role});

        return userDB;
    }

    async login(email: string, password: string): Promise<IUserDB> {
        const userDB: IUserDB | null = await UserModel.findOne({email});
        if (!userDB) {
            throw ApiError.BadRequest("User not found");
        }

        const isPasswordValid = await argon2.verify(userDB._doc.password, password);
        if (!isPasswordValid) {
            throw ApiError.BadRequest("Invalid password");
        }

        return userDB;
    }

    async logout(refreshToken: string): Promise<void> {
        await tokenService.removeToken(refreshToken);
    }
}

export default new AuthService();
