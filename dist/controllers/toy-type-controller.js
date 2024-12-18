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
const toy_type_service_1 = __importDefault(require("../services/toy-type-service"));
class ToyTypeController {
    create(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { supplier_id, personage_object_state_id, default_scenario_id, name, price, description } = request.body;
                const imageFile = request.file;
                if (!mongoose_1.Types.ObjectId.isValid(supplier_id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${supplier_id}`));
                }
                if (!mongoose_1.Types.ObjectId.isValid(personage_object_state_id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${personage_object_state_id}`));
                }
                if (!mongoose_1.Types.ObjectId.isValid(default_scenario_id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${default_scenario_id}`));
                }
                if (!price) {
                    return next(api_error_1.default.BadRequest("Price is required."));
                }
                if (!name) {
                    return next(api_error_1.default.BadRequest("Name is required."));
                }
                if (!description) {
                    return next(api_error_1.default.BadRequest("Description is required."));
                }
                const toyType = {
                    supplier_id,
                    personage_object_state_id,
                    default_scenario_id,
                    name,
                    price,
                    description,
                    imageSrc: imageFile === null || imageFile === void 0 ? void 0 : imageFile.path.split("\\")[1]
                };
                const toyTypeDB = yield toy_type_service_1.default.create(toyType);
                const toyTypeResponse = Object.assign({ id: toyTypeDB._id }, toyTypeDB._doc);
                response.status(201).json(toyTypeResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAll(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const toyTypesDB = yield toy_type_service_1.default.getAll();
                const toyTypesResponse = {
                    data: toyTypesDB.map((item) => (Object.assign({ id: item._id }, item._doc))),
                    total: toyTypesDB.length
                };
                response.status(200).json(toyTypesResponse);
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
                const toyTypeDB = yield toy_type_service_1.default.getById(id);
                const toyTypeResponse = Object.assign({ id: toyTypeDB._id }, toyTypeDB._doc);
                response.status(200).json(toyTypeResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, supplier_id, personage_object_state_id, default_scenario_id, name, price, description } = request.body;
                const imageFile = request.file;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                if (!mongoose_1.Types.ObjectId.isValid(supplier_id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${supplier_id}`));
                }
                if (!mongoose_1.Types.ObjectId.isValid(personage_object_state_id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${personage_object_state_id}`));
                }
                if (!mongoose_1.Types.ObjectId.isValid(default_scenario_id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${default_scenario_id}`));
                }
                if (!price) {
                    return next(api_error_1.default.BadRequest("Price is required."));
                }
                if (!name) {
                    return next(api_error_1.default.BadRequest("Name is required."));
                }
                if (!description) {
                    return next(api_error_1.default.BadRequest("Description is required."));
                }
                if (imageFile) {
                    const toyTypeDB = yield toy_type_service_1.default.getById(id);
                }
                const toyType = {
                    supplier_id,
                    personage_object_state_id,
                    default_scenario_id,
                    name,
                    price,
                    description,
                    imageSrc: imageFile === null || imageFile === void 0 ? void 0 : imageFile.path.split("\\")[1]
                };
                const toyTypeDB = yield toy_type_service_1.default.update(id, toyType);
                const toyTypeResponse = Object.assign({ id: toyTypeDB._id }, toyTypeDB._doc);
                response.status(200).json(toyTypeResponse);
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
                const message = yield toy_type_service_1.default.delete(id);
                response.status(200).json(message);
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
                const message = yield toy_type_service_1.default.deleteMany(ids);
                response.status(200).json(message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    searchByPriceRange(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { minPrice, maxPrice } = request.query;
                if (!minPrice || !maxPrice) {
                    return next(api_error_1.default.BadRequest('Min price and max price are required.'));
                }
                const toyTypes = yield toy_type_service_1.default.searchByPriceRange(Number(minPrice), Number(maxPrice));
                response.status(200).json(toyTypes);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new ToyTypeController();
