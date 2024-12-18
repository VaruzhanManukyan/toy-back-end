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
class UserService {
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidateWithEmail = yield user_model_1.default.findOne({ email: user.email });
            if (candidateWithEmail) {
                throw api_error_1.default.BadRequest(`User with this email address ${user.email} already exists`);
            }
            const hashPassword = yield argon2_1.default.hash(user.password);
            user.password = hashPassword;
            const userDB = new user_model_1.default(user);
            userDB.save();
            return userDB;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersDB = yield user_model_1.default.find();
                return usersDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDB = yield user_model_1.default.findById(id);
                if (!userDB) {
                    throw api_error_1.default.BadRequest(`User with ID ${id} not found.`);
                }
                return userDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidateWithEmail = yield user_model_1.default.findOne({ email: user.email });
                if (candidateWithEmail && id.toString() !== candidateWithEmail._id.toString()) {
                    throw api_error_1.default.BadRequest(`User with this email address ${user.email} already exists`);
                }
                const userDB = yield user_model_1.default.findByIdAndUpdate({ _id: id }, { $set: user }, { new: true });
                if (!userDB) {
                    throw api_error_1.default.BadRequest(`User with ID ${id} not found.`);
                }
                return userDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield user_model_1.default.deleteOne({ _id: id });
                if (result.deletedCount === 0) {
                    throw api_error_1.default.BadRequest(`No user found for the provided IDs.`);
                }
                return `${result.deletedCount} User deleted successfully.`;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteMany(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield user_model_1.default.deleteMany({ _id: { $in: ids } });
                if (result.deletedCount === 0) {
                    throw api_error_1.default.BadRequest(`No Users found for the provided IDs.`);
                }
                return `${result.deletedCount} Users deleted successfully.`;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new UserService();
