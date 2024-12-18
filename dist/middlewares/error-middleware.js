"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const api_error_1 = __importDefault(require("../exceptions/api-error"));
function default_1(error, request, response, next) {
    if (error instanceof api_error_1.default) {
        return response.status(error.status).json({ message: error.message, errors: error.errors });
    }
    console.error('Unexpected error:', error.message);
    return response.status(500).json({ message: "Unexpected error" });
}
