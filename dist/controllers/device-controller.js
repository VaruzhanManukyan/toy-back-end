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
const device_service_1 = __importDefault(require("../services/device-service"));
class DeviceController {
    create(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { supplier_id, serial_number } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(supplier_id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${supplier_id}`));
                }
                if (!serial_number) {
                    return next(api_error_1.default.BadRequest(`Serial number is required: ${serial_number}`));
                }
                const device = {
                    supplier_id,
                    serial_number
                };
                const deviceDB = yield device_service_1.default.create(device);
                const deviceResponse = Object.assign({ id: deviceDB._id }, deviceDB._doc);
                response.status(201).json(deviceResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAll(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const devicesDB = yield device_service_1.default.getAll();
                const devicesDBResponse = {
                    data: devicesDB.map((item) => (Object.assign({ id: item._id }, item._doc))),
                    total: devicesDB.length
                };
                response.status(200).json(devicesDBResponse);
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
                const deviceDB = yield device_service_1.default.getById(id);
                const deviceResponse = Object.assign({ id: deviceDB._id }, deviceDB._doc);
                response.status(200).json(deviceResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, supplier_id, serial_number } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                if (!mongoose_1.Types.ObjectId.isValid(supplier_id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${supplier_id}`));
                }
                const device = {
                    supplier_id,
                    serial_number
                };
                const deviceDB = yield device_service_1.default.update(id, device);
                const deviceResponse = Object.assign({ id: deviceDB._id }, deviceDB._doc);
                response.status(200).json(deviceResponse);
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
                const message = yield device_service_1.default.delete(id);
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
                if (!Array.isArray(ids) || ids.some((id) => !mongoose_1.Types.ObjectId.isValid(id))) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format in array: ${JSON.stringify(ids)}`));
                }
                const message = yield device_service_1.default.deleteMany(ids);
                response.status(200).json({ message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    connect(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, user_id } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                if (!mongoose_1.Types.ObjectId.isValid(user_id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${user_id}`));
                }
                const deviceDB = yield device_service_1.default.connect(id, user_id);
                const deviceResponse = Object.assign({ id: deviceDB._id }, deviceDB._doc);
                response.status(200).json(deviceResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new DeviceController();
