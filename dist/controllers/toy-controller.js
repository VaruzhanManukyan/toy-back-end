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
const toy_service_1 = __importDefault(require("../services/toy-service"));
class ToyController {
    create(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { toy_type_id, RFID } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(toy_type_id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${toy_type_id}`));
                }
                if (!toy_type_id) {
                    return next(api_error_1.default.BadRequest("Toy type ID is required"));
                }
                if (!RFID) {
                    return next(api_error_1.default.BadRequest("RFID is required"));
                }
                const toy = { toy_type_id, RFID };
                const toyDB = yield toy_service_1.default.create(toy);
                const toyResponse = Object.assign({ id: toyDB._id }, toyDB._doc);
                response.status(201).json(toyResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAll(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const toysDB = yield toy_service_1.default.getAll();
                const toysResponse = {
                    data: toysDB.map((item) => (Object.assign({ id: item._id }, item._doc))),
                    total: toysDB.length
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
                const toyDB = yield toy_service_1.default.getById(id);
                const toyResponse = Object.assign({ id: toyDB._id }, toyDB._doc);
                response.status(200).json(toyResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, toy_type_id, RFID } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                if (!mongoose_1.Types.ObjectId.isValid(toy_type_id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${toy_type_id}`));
                }
                if (!toy_type_id) {
                    return next(api_error_1.default.BadRequest("Toy type ID is required"));
                }
                if (!RFID) {
                    return next(api_error_1.default.BadRequest("RFID is required"));
                }
                const toy = { toy_type_id, RFID };
                const toyDB = yield toy_service_1.default.update(id, toy);
                const toyResponse = Object.assign({ id: toyDB._id }, toyDB._doc);
                response.status(200).json(toyResponse);
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
                const message = yield toy_service_1.default.delete(id);
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
                const message = yield toy_service_1.default.deleteMany(ids);
                response.status(200).json({ message });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new ToyController();
