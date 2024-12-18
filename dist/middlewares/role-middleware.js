"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const api_error_1 = __importDefault(require("../exceptions/api-error"));
function roleMiddleware(roles) {
    return (request, response, next) => {
        passport_1.default.authenticate('jwt', { session: false }, (error, user) => {
            if (error) {
                return next(error);
            }
            if (!user) {
                return next(api_error_1.default.UnauthorizedError());
            }
            if (!roles.includes(user.role)) {
                return next(api_error_1.default.ForbiddenError());
            }
            request.user = user;
            next();
        })(request, response, next);
    };
}
exports.default = roleMiddleware;
