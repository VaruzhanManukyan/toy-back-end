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
const description_state_service_1 = __importDefault(require("../services/description-state-service"));
class DescriptionStateController {
    create(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = request.body;
                if (!name) {
                    return next(api_error_1.default.BadRequest("Name is required."));
                }
                const descriptionState = { name };
                const descriptionStateDB = yield description_state_service_1.default.create(descriptionState);
                const descriptionStateResponse = Object.assign({ id: descriptionStateDB._id }, descriptionStateDB._doc);
                response.status(201).json(descriptionStateResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAll(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const descriptionStatesDB = yield description_state_service_1.default.getAll();
                const descriptionStatesResponse = {
                    data: descriptionStatesDB.map((item) => (Object.assign({ id: item._id }, item._doc))),
                    total: descriptionStatesDB.length
                };
                response.status(200).json(descriptionStatesResponse);
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
                const descriptionStateDB = yield description_state_service_1.default.getById(id);
                const descriptionStatesResponse = Object.assign({ id: descriptionStateDB._id }, descriptionStateDB._doc);
                response.status(200).json(descriptionStatesResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                if (!name) {
                    return next(api_error_1.default.BadRequest("Name is required."));
                }
                const descriptionState = { name };
                const descriptionStateDB = yield description_state_service_1.default.update(id, descriptionState);
                const descriptionStateResponse = Object.assign({ id: descriptionStateDB._id }, descriptionStateDB._doc);
                response.status(200).json(descriptionStateResponse);
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
                const message = yield description_state_service_1.default.delete(id);
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
                for (const id of ids) {
                    if (!mongoose_1.Types.ObjectId.isValid(id)) {
                        return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                    }
                }
                const message = yield description_state_service_1.default.deleteMany(ids);
                response.status(200).json({ message });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new DescriptionStateController();
