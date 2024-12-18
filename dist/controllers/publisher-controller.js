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
const publisher_service_1 = __importDefault(require("../services/publisher-service"));
class PublisherController {
    create(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, phone } = request.body;
                if (!name) {
                    return next(api_error_1.default.BadRequest("Name is required."));
                }
                if (!email) {
                    return next(api_error_1.default.BadRequest("Email is required."));
                }
                if (!password) {
                    return next(api_error_1.default.BadRequest("Password is required."));
                }
                if (!phone) {
                    return next(api_error_1.default.BadRequest("Phone is required."));
                }
                const publisher = {
                    scenario_ids: [],
                    name,
                    email,
                    password,
                    phone
                };
                const publisherDB = yield publisher_service_1.default.create(publisher);
                const publisherResponse = Object.assign({ id: publisherDB._id }, publisherDB._doc);
                response.status(201).json(publisherResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAll(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const publishersDB = yield publisher_service_1.default.getAll();
                const publisherAllResponse = {
                    data: publishersDB.map(item => (Object.assign({ id: item._id }, item._doc))),
                    total: publishersDB.length
                };
                response.status(200).json(publisherAllResponse);
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
                const publisherDB = yield publisher_service_1.default.getById(id);
                const publisherResponse = Object.assign({ id: publisherDB._id }, publisherDB._doc);
                response.status(200).json(publisherResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name, email, phone } = request.body;
                if (!name) {
                    return next(api_error_1.default.BadRequest("Name is required."));
                }
                if (!email) {
                    return next(api_error_1.default.BadRequest("Email is required."));
                }
                if (!phone) {
                    return next(api_error_1.default.BadRequest("Phone is required."));
                }
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                const publisher = {
                    scenario_ids: [],
                    name,
                    email,
                    phone
                };
                const publisherDB = yield publisher_service_1.default.update(id, publisher);
                const publisherResponse = Object.assign({ id: publisherDB._id }, publisherDB._doc);
                response.status(200).json(publisherResponse);
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
                const message = yield publisher_service_1.default.delete(id);
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
                const messages = yield publisher_service_1.default.deleteMany(ids);
                response.status(200).json({ messages });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new PublisherController();
