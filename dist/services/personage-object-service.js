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
const personage_object_model_1 = __importDefault(require("../models/personage-object-model"));
const personage_object_state_model_1 = __importDefault(require("../models/personage-object-state-model"));
class PersonageObjectService {
    create(personageObject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidateWithName = yield personage_object_model_1.default.findOne({ name: personageObject.name });
                if (candidateWithName) {
                    throw api_error_1.default.BadRequest(`Personage object with this name ${personageObject.name} already exists.`);
                }
                const personageObjectDB = new personage_object_model_1.default(personageObject);
                yield personageObjectDB.save();
                return personageObjectDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const personageObjectsDB = yield personage_object_model_1.default.find();
                return personageObjectsDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const personageObjectDB = yield personage_object_model_1.default.findById(id);
                if (!personageObjectDB) {
                    throw api_error_1.default.NotFound(`Personage object with id ${id} not found.`);
                }
                return personageObjectDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, personageObject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidateWithName = yield personage_object_model_1.default.findOne({ name: personageObject.name });
                if (candidateWithName && id.toString() !== candidateWithName._id.toString()) {
                    throw api_error_1.default.BadRequest(`Personage object with this name ${name} already exists.`);
                }
                const personageObjectDB = yield personage_object_model_1.default.findOneAndUpdate({ _id: id }, { $set: personageObject }, { new: true });
                if (!personageObjectDB) {
                    throw api_error_1.default.NotFound(`Personage object with id ${id} not found.`);
                }
                return personageObjectDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield personage_object_state_model_1.default.deleteMany({ personage_object_id: id });
                const result = yield personage_object_model_1.default.deleteOne({ _id: id });
                if (result.deletedCount === 0) {
                    throw api_error_1.default.NotFound(`Personage object with id ${id} not found.`);
                }
                return "Personage object and its related states have been deleted.";
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteMany(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield personage_object_state_model_1.default.deleteMany({ personage_object_id: { $in: ids } });
                const result = yield personage_object_model_1.default.deleteMany({ _id: { $in: ids } });
                if (result.deletedCount === 0) {
                    throw api_error_1.default.NotFound(`No Personage objects found for the provided ids.`);
                }
                return "Personage objects and their related states have been deleted.";
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new PersonageObjectService();
