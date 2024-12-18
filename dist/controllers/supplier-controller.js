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
const supplier_service_1 = __importDefault(require("../services/supplier-service"));
class SupplierController {
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
                const supplier = {
                    name,
                    email,
                    password,
                    phone
                };
                const supplierDB = yield supplier_service_1.default.create(supplier);
                const supplierResponse = Object.assign({ id: supplierDB._id }, supplierDB._doc);
                response.status(201).json(supplierResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAll(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const suppliersDB = yield supplier_service_1.default.getAll();
                const suppliersResponse = {
                    data: suppliersDB.map((item) => (Object.assign({ id: item._id }, item._doc))),
                    total: suppliersDB.length
                };
                response.status(200).json(suppliersResponse);
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
                const supplierDB = yield supplier_service_1.default.getById(id);
                const supplierResponse = Object.assign({ id: supplierDB._id }, supplierDB._doc);
                response.status(200).json(supplierResponse);
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
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                if (!name) {
                    return next(api_error_1.default.BadRequest("Name is required."));
                }
                if (!email) {
                    return next(api_error_1.default.BadRequest("Email is required."));
                }
                if (!phone) {
                    return next(api_error_1.default.BadRequest("Phone is required."));
                }
                const supplier = {
                    name,
                    email,
                    phone
                };
                const supplierDB = yield supplier_service_1.default.update(id, supplier);
                const supplierResponse = Object.assign({ id: supplierDB._id }, supplierDB._doc);
                response.status(200).json(supplierResponse);
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
                const message = yield supplier_service_1.default.delete(id);
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
                const message = yield supplier_service_1.default.deleteMany(ids);
                response.status(200).json({ message });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new SupplierController();
