"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const token_service_1 = __importDefault(require("../services/token-service"));
const authMiddleware = (request, response, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (error, user) => {
        var _a;
        const authHeader = request.headers.authorization;
        const refreshToken = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!(authHeader && refreshToken)) {
            return next(api_error_1.default.UnauthorizedError());
        }
        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) {
            return next(api_error_1.default.UnauthorizedError());
        }
        const userData = token_service_1.default.validateAccessToken(accessToken);
        if (!userData) {
            return next(api_error_1.default.UnauthorizedError());
        }
        request.user = userData;
        next();
    })(request, response, next);
};
exports.default = authMiddleware;
