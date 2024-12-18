import { Request, Response, NextFunction } from 'express';
import ApiError from "../exceptions/api-error";

export default function (error: Error | ApiError, request: Request, response: Response, next: NextFunction) {
    if (error instanceof ApiError) {
        return response.status(error.status).json({message: error.message, errors: error.errors});
    }
    console.error('Unexpected error:', error.message);
    return response.status(500).json({message: "Unexpected error"});
}