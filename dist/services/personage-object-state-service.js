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
const personage_object_state_model_1 = __importDefault(require("../models/personage-object-state-model"));
class PersonageObjectStateService {
    create(personageObjectState) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidateWithName = yield personage_object_state_model_1.default.findOne({ name: personageObjectState.name });
                if (candidateWithName) {
                    throw api_error_1.default.BadRequest(`Personage object state with this name ${personageObjectState.name} already exists.`);
                }
                const personageObjectStateDB = new personage_object_state_model_1.default(personageObjectState);
                yield personageObjectStateDB.save();
                return personageObjectStateDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const personageObjectsStateDB = yield personage_object_state_model_1.default.find();
            return personageObjectsStateDB;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const personageObjectStateDB = yield personage_object_state_model_1.default.findById(id);
                if (!personageObjectStateDB) {
                    throw api_error_1.default.NotFound(`Personage object state with id ${id} not found.`);
                }
                return personageObjectStateDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, personageObjectState) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidateWithName = yield personage_object_state_model_1.default.findOne({ name: personageObjectState.name });
            if (candidateWithName && id.toString() !== candidateWithName._id.toString()) {
                throw api_error_1.default.BadRequest(`Personage object with this name ${name} already exists.`);
            }
            const personageObjectStateDB = yield personage_object_state_model_1.default.findOneAndUpdate({ _id: id }, { $set: personageObjectState }, { new: true });
            if (!personageObjectStateDB) {
                throw api_error_1.default.NotFound(`Personage object state with id ${id} not found.`);
            }
            return personageObjectStateDB;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield personage_object_state_model_1.default.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                throw api_error_1.default.NotFound(`Personage object state with id ${id} not found.`);
            }
            return "Personage object state is deleted.";
        });
    }
    deleteMany(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield personage_object_state_model_1.default.deleteMany({ _id: { $in: ids } });
            if (result.deletedCount === 0) {
                throw api_error_1.default.NotFound(`No personage object states found for the provided IDs.`);
            }
            return `${result.deletedCount} personage object state deleted.`;
        });
    }
}
exports.default = new PersonageObjectStateService();
