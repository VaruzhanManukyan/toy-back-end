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
const device_model_1 = __importDefault(require("../models/device-model"));
const user_model_1 = __importDefault(require("../models/user-model"));
class DeviceService {
    create(device) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { serial_number } = device;
                const candidateWithSerialNumber = yield device_model_1.default.findOne({ serial_number });
                if (candidateWithSerialNumber) {
                    throw api_error_1.default.BadRequest(`Device with this serial number ${serial_number} already exists.`);
                }
                const deviceDB = new device_model_1.default(device);
                yield deviceDB.save();
                return deviceDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const devicesDB = yield device_model_1.default.find();
                return devicesDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceDB = yield device_model_1.default.findById(id);
                if (!deviceDB) {
                    throw api_error_1.default.BadRequest(`Device with id ${id} not found.`);
                }
                return deviceDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, device) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { serial_number } = device;
                const candidateWithSerialNumber = yield device_model_1.default.findOne({ serial_number });
                if (candidateWithSerialNumber && id.toString() !== candidateWithSerialNumber._id.toString()) {
                    throw api_error_1.default.BadRequest(`Device with this serial number ${serial_number} already exists.`);
                }
                const deviceDB = yield device_model_1.default.findByIdAndUpdate({ _id: id }, { $set: device }, { new: true });
                if (!deviceDB) {
                    throw api_error_1.default.BadRequest(`Device with id ${id} not found.`);
                }
                return deviceDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const device = yield device_model_1.default.findByIdAndDelete(id);
                if (!device) {
                    throw api_error_1.default.BadRequest(`Device with id ${id} not found.`);
                }
                return 'Device has been deleted.';
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteMany(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield device_model_1.default.deleteMany({ _id: { $in: ids } });
            if (result.deletedCount === 0) {
                throw api_error_1.default.NotFound(`No devices found for the provided IDs.`);
            }
            return `${result.deletedCount} devices deleted.`;
        });
    }
    connect(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(id) || !mongoose_1.Types.ObjectId.isValid(userId)) {
                throw api_error_1.default.BadRequest(`Invalid id(s) ${id}, ${userId}.`);
            }
            const device = yield device_model_1.default.findById(id);
            if (!device) {
                throw api_error_1.default.BadRequest(`Device with id ${id} not found.`);
            }
            const user = yield user_model_1.default.findById(userId);
            if (!user) {
                throw api_error_1.default.BadRequest(`User with id ${userId} not found.`);
            }
            const deviceObjectId = new mongoose_1.Types.ObjectId(id);
            if (!user._doc.device_ids.includes(deviceObjectId)) {
                user._doc.device_ids.push(deviceObjectId);
                yield user.save();
            }
            return device;
        });
    }
}
exports.default = new DeviceService();
