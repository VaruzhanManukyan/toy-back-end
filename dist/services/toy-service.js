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
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const toy_model_1 = __importDefault(require("../models/toy-model"));
class ToyService {
    create(toy) {
        return __awaiter(this, void 0, void 0, function* () {
            const { RFID } = toy;
            const candidateWithRFID = yield toy_model_1.default.findOne({ RFID });
            if (candidateWithRFID) {
                throw api_error_1.default.BadRequest(`Toy with this RFID ${RFID} already exists.`);
            }
            const toyDB = new toy_model_1.default(toy);
            yield toyDB.save();
            return toyDB;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const toysDB = yield toy_model_1.default.find();
            return toysDB;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const toysDB = yield toy_model_1.default.findById(id);
            if (!toysDB) {
                throw api_error_1.default.BadRequest(`Toy with id ${id} not found.`);
            }
            return toysDB;
        });
    }
    update(id, toy) {
        return __awaiter(this, void 0, void 0, function* () {
            const { RFID } = toy;
            const candidateWithRFID = yield toy_model_1.default.findOne({ RFID });
            if (candidateWithRFID && id.toString() !== candidateWithRFID._id.toString()) {
                throw api_error_1.default.BadRequest(`Toy with this RFID ${RFID} already exists.`);
            }
            const toyDB = yield toy_model_1.default.findByIdAndUpdate(id, { $set: toy }, { new: true });
            if (!toyDB) {
                throw api_error_1.default.BadRequest(`Toy with id ${id.toString()} not found.`);
            }
            return toyDB;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield toy_model_1.default.deleteOne({ _id: id });
                if (result.deletedCount === 0) {
                    throw api_error_1.default.BadRequest(`No Toy found for the provided IDs.`);
                }
                return `${result.deletedCount} Toy deleted successfully.`;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteMany(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield toy_model_1.default.deleteMany({ _id: { $in: ids } });
                if (result.deletedCount === 0) {
                    throw api_error_1.default.BadRequest(`No Toys found for the provided IDs.`);
                }
                return `${result.deletedCount} Toys deleted successfully.`;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new ToyService();
