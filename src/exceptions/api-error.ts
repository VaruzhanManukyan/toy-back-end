import {Error} from "mongoose";
import {ValidationError} from "express-validator";

export default class ApiError extends Error {
    status: number;
    errors: ValidationError[];

    constructor(status: number, message: string, errors: ValidationError[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(): ApiError {
        console.log(this.messages);
        return new ApiError(401, "User is not authorized");
    }

    static ForbiddenError(): ApiError {
        console.log(this.messages);
        return new ApiError(403, "User does not have access to the resource");
    }

    static NotFound(message: string, errors?: ValidationError[]): ApiError {
        console.log(this.messages);
        return new ApiError(404, message, errors);
    }

    static BadRequest(message: string, errors?: ValidationError[]): ApiError {
        console.log(this.messages);
        return new ApiError(400, message, errors);
    }
}
