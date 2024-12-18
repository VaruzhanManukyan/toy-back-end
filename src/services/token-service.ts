import jwt from "jsonwebtoken";
import {Types} from "mongoose";
import {IUserDB} from "../shared/interfaces/user-interfaces";
import {IJwt} from "../shared/interfaces/token-interfaces";
import tokenModel from "../models/token-model";

class TokenService {
    generateTokens(user: IUserDB) {
        const payload = {id: user._id, email: user._doc.email, role: user._doc.role};
        const accessToken: string = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY as string, {expiresIn: "5h"});
        const refreshToken: string = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY as string, {expiresIn: "30d"});
        return {
            accessToken,
            refreshToken
        };
    }

    validateAccessToken(token: string) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY as string) as IJwt;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token: string) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY as string) as IJwt;
        } catch (error) {
            return null;
        }
    }

    async saveToken(user_id: Types.ObjectId, refreshToken: string) {
        const tokenData = await tokenModel.findOne({user: user_id});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await tokenModel.create({user: user_id, refreshToken});
    }

    async removeToken(refreshToken: string) {
        return await tokenModel.deleteOne({refreshToken});
    }

    async findToken(refreshToken: string) {
        const token: IJwt = await tokenModel.findOne({refreshToken}) as IJwt;
        return token;
    }
}

export default new TokenService();
