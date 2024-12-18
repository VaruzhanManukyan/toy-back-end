"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const role_enum_1 = require("../shared/enums/role-enum");
const user_service_1 = __importDefault(require("../services/user-service"));
const token_service_1 = __importDefault(require("../services/token-service"));
const auth_service_1 = __importDefault(require("../services/auth-service"));
class AuthController {
    registration(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, role } = request.body;
                if (role === role_enum_1.Roles.SUPER_ADMIN || !Object.values(role_enum_1.Roles).includes(role)) {
                    return next(api_error_1.default.BadRequest(`User with role ${role} cannot be created`));
                }
                const user = yield auth_service_1.default.registration(email, password, role);
                const tokens = token_service_1.default.generateTokens(user);
                yield token_service_1.default.saveToken(user._id, tokens.refreshToken);
                response.cookie('refreshToken', tokens.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    path: "/"
                });
                response.status(201).json({ accessToken: tokens.accessToken });
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = request.body;
                const userDB = yield auth_service_1.default.login(email, password);
                const tokens = token_service_1.default.generateTokens(userDB);
                yield token_service_1.default.saveToken(userDB._id, tokens.refreshToken);
                response.cookie('refreshToken', tokens.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    path: "/"
                });
                response.status(200).json({ accessToken: tokens.accessToken });
            }
            catch (error) {
                next(error);
            }
        });
    }
    refreshToken(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = request.cookies.refreshToken;
                if (!refreshToken) {
                    throw api_error_1.default.UnauthorizedError();
                }
                const userData = token_service_1.default.validateRefreshToken(refreshToken);
                const tokenFromDb = yield token_service_1.default.findToken(refreshToken);
                if (!userData || !tokenFromDb) {
                    throw api_error_1.default.UnauthorizedError();
                }
                const user_id = new mongoose_1.Types.ObjectId(userData.id);
                const userDB = yield user_service_1.default.getById(user_id);
                const tokens = token_service_1.default.generateTokens(userDB);
                yield token_service_1.default.saveToken(user_id, tokens.refreshToken);
                response.cookie('refreshToken', tokens.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    path: "/"
                });
                response.json({ accessToken: tokens.accessToken });
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = request.cookies.refreshToken;
                yield token_service_1.default.removeToken(refreshToken);
                response.clearCookie('refreshToken');
                response.status(200).json({ message: "Logout successful" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new AuthController();
