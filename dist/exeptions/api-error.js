"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class ApiError extends mongoose_1.Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static UnauthorizedError() {
        return new ApiError(401, "User is not authorized");
    }
    static ForbiddenError() {
        return new ApiError(403, "User does not have access to the resource");
    }
    static BadRequest(message, errors) {
        return new ApiError(400, message, errors);
    }
}
exports.default = ApiError;
