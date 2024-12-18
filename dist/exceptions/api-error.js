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
        console.log(this.messages);
        return new ApiError(401, "User is not authorized");
    }
    static ForbiddenError() {
        console.log(this.messages);
        return new ApiError(403, "User does not have access to the resource");
    }
    static NotFound(message, errors) {
        console.log(this.messages);
        return new ApiError(404, message, errors);
    }
    static BadRequest(message, errors) {
        console.log(this.messages);
        return new ApiError(400, message, errors);
    }
}
exports.default = ApiError;
