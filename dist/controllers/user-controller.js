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
const user_service_1 = __importDefault(require("../services/user-service"));
class UserController {
    create(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = request.body;
                if (!email) {
                    return next(api_error_1.default.BadRequest("Email is required"));
                }
                if (!password) {
                    return next(api_error_1.default.BadRequest("Password is required"));
                }
                const user = {
                    email,
                    password,
                    role: "USER",
                    device_ids: [],
                    scenario_ids: []
                };
                const userDB = yield user_service_1.default.create(user);
                const userResponse = Object.assign({ id: userDB._id }, userDB._doc);
                response.status(201).json(userResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAll(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersDB = yield user_service_1.default.getAll();
                const toysResponse = {
                    data: usersDB.map((item) => (Object.assign({ id: item._id }, item._doc))),
                    total: usersDB.length
                };
                response.status(200).json(toysResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                const userDB = yield user_service_1.default.getById(id);
                const userResponse = Object.assign({ id: userDB._id }, userDB._doc);
                response.status(200).json(userResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, email, password, device_ids, scenario_ids } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                if (!email) {
                    return next(api_error_1.default.BadRequest("Email is required"));
                }
                const user = {
                    email,
                    password,
                    role: "USER",
                    device_ids,
                    scenario_ids
                };
                const userDB = yield user_service_1.default.update(id, user);
                const userResponse = Object.assign({ id: userDB._id }, userDB._doc);
                response.status(200).json(userResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    delete(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                const message = yield user_service_1.default.delete(id);
                response.status(200).json({ message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteMany(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ids } = request.body;
                if (!Array.isArray(ids) || !ids.every(id => mongoose_1.Types.ObjectId.isValid(id))) {
                    return next(api_error_1.default.BadRequest("Invalid ID format(s) in the request."));
                }
                const message = yield user_service_1.default.deleteMany(ids);
                response.status(200).json({ message });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new UserController();
