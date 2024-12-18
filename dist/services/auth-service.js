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
const argon2_1 = __importDefault(require("argon2"));
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const user_model_1 = __importDefault(require("../models/user-model"));
const token_service_1 = __importDefault(require("./token-service"));
class AuthService {
    registration(email, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield user_model_1.default.findOne({ email });
            if (existingUser) {
                throw api_error_1.default.BadRequest(`User with email ${email} already exists`);
            }
            const hashedPassword = yield argon2_1.default.hash(password);
            const userDB = yield user_model_1.default.create({ email, password: hashedPassword, role });
            return userDB;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDB = yield user_model_1.default.findOne({ email });
            if (!userDB) {
                throw api_error_1.default.BadRequest("User not found");
            }
            const isPasswordValid = yield argon2_1.default.verify(userDB._doc.password, password);
            if (!isPasswordValid) {
                throw api_error_1.default.BadRequest("Invalid password");
            }
            return userDB;
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield token_service_1.default.removeToken(refreshToken);
        });
    }
}
exports.default = new AuthService();
