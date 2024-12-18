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
const description_state_model_1 = __importDefault(require("../models/description-state-model"));
const personage_object_state_model_1 = __importDefault(require("../models/personage-object-state-model"));
class DescriptionStateService {
    create(descriptionState) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidateWithName = yield description_state_model_1.default.findOne({ name: descriptionState.name });
                if (candidateWithName) {
                    throw api_error_1.default.BadRequest(`Description state with this name ${descriptionState.name} already exists.`);
                }
                const descriptionStateDB = new description_state_model_1.default(descriptionState);
                yield descriptionStateDB.save();
                return descriptionStateDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const descriptionStatesDB = yield description_state_model_1.default.find();
                return descriptionStatesDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const descriptionStateDB = yield description_state_model_1.default.findById(id);
                if (!descriptionStateDB) {
                    throw api_error_1.default.NotFound(`Description state with id ${id} not found.`);
                }
                return descriptionStateDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, descriptionState) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidateWithName = yield description_state_model_1.default.findOne({ name: descriptionState.name });
                if (candidateWithName && id.toString() !== candidateWithName._id.toString()) {
                    throw api_error_1.default.BadRequest(`Description state with this name ${name} already exists.`);
                }
                const IDescriptionStateDB = yield description_state_model_1.default.findOneAndUpdate({ _id: id }, { $set: descriptionState }, { new: true });
                if (!IDescriptionStateDB) {
                    throw api_error_1.default.NotFound(`Description state with id ${id} not found.`);
                }
                return IDescriptionStateDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield description_state_model_1.default.deleteOne({ _id: id });
                if (result.deletedCount === 0) {
                    throw api_error_1.default.NotFound(`Description state with id ${id} not found.`);
                }
                yield personage_object_state_model_1.default.updateMany({ description_state_ids: id }, { $pull: { description_state_ids: id } });
                return "Description state is deleted and related references are updated.";
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteMany(descriptionStateIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield description_state_model_1.default.deleteMany({ _id: { $in: descriptionStateIds } });
                if (result.deletedCount === 0) {
                    throw api_error_1.default.NotFound(`No DescriptionStates found for the provided ids.`);
                }
                yield personage_object_state_model_1.default.updateMany({ description_state_ids: { $in: descriptionStateIds } }, { $pull: { description_state_ids: { $in: descriptionStateIds } } });
                return "Description states and related references are deleted.";
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new DescriptionStateService();
