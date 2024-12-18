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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const toy_type_model_1 = __importDefault(require("../models/toy-type-model"));
class ToyTypeService {
    create(toyType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidateWithName = yield toy_type_model_1.default.findOne({ name: toyType.name });
                if (candidateWithName) {
                    throw api_error_1.default.BadRequest(`Tou type with this name ${toyType.name} already exists.`);
                }
                const toyTypeDB = new toy_type_model_1.default(toyType);
                yield toyTypeDB.save();
                let newPath = "";
                if (toyTypeDB._doc.imageSrc) {
                    newPath = `${toyTypeDB._id}%${toyTypeDB._doc.imageSrc.split("%")[1]}`;
                    fs_1.default.renameSync(`uploads-image\\${toyTypeDB._doc.imageSrc}`, `uploads-image\\${newPath}`);
                }
                const toyTypeDBUpdate = yield toy_type_model_1.default.findOneAndUpdate({ _id: toyTypeDB._id }, { $set: { imageSrc: newPath } }, { new: true });
                if (!toyTypeDBUpdate) {
                    throw api_error_1.default.BadRequest(`Tou type with id ${toyTypeDB._id} not found.`);
                }
                return toyTypeDBUpdate;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ToyTypesDB = yield toy_type_model_1.default.find();
                return ToyTypesDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const toyTypeDB = yield toy_type_model_1.default.findById(id);
                if (!toyTypeDB) {
                    throw api_error_1.default.BadRequest(`Tou type with ID ${id} not found.`);
                }
                return toyTypeDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, toyType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidateWithName = yield toy_type_model_1.default.findOne({ name: toyType.name });
                if (candidateWithName && id.toString() !== candidateWithName._id.toString()) {
                    throw api_error_1.default.BadRequest(`Toy type with this name ${name} already exists.`);
                }
                const toyTypeDB = yield toy_type_model_1.default.findById(id);
                if (!toyTypeDB) {
                    throw api_error_1.default.BadRequest(`ToyType with ID ${id} not found.`);
                }
                if (toyTypeDB._doc.imageSrc !== toyType.imageSrc) {
                    const filePath = path_1.default.resolve(`uploads-image\\${toyTypeDB._doc.imageSrc}`);
                    fs_1.default.unlink(filePath, (error) => {
                        if (error) {
                            console.error(`Failed to delete file ${filePath}: ${error.message}`);
                        }
                    });
                }
                const toyTypeDBUpdated = yield toy_type_model_1.default.findByIdAndUpdate({ _id: id }, { $set: toyType }, { new: true });
                if (!toyTypeDBUpdated) {
                    throw api_error_1.default.BadRequest(`Tou type with ID ${id} not found.`);
                }
                return toyTypeDBUpdated;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const toyTypeDB = yield toy_type_model_1.default.findById(id);
                if (!toyTypeDB) {
                    throw api_error_1.default.BadRequest(`Tou type with ID ${id} not found.`);
                }
                const result = yield toy_type_model_1.default.findByIdAndDelete(id);
                if (!result) {
                    throw api_error_1.default.BadRequest(`Toy type with ID ${id} not found.`);
                }
                const filePath = path_1.default.resolve(`uploads-image\\${toyTypeDB._doc.imageSrc}`);
                fs_1.default.unlink(filePath, (error) => {
                    if (error) {
                        console.error(`Failed to delete file ${filePath}: ${error.message}`);
                    }
                });
                return "Toy type is delete";
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteMany(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let deletedCount = 0;
                for (const id of ids) {
                    const toyTypeDB = yield toy_type_model_1.default.findById(id);
                    if (!toyTypeDB) {
                        throw api_error_1.default.BadRequest(`Tou type with ID ${id} not found.`);
                    }
                    const filePath = path_1.default.resolve(`uploads-image\\${toyTypeDB._doc.imageSrc}`);
                    fs_1.default.unlink(filePath, (error) => {
                        if (error) {
                            console.error(`Failed to delete file ${filePath}: ${error.message}`);
                        }
                    });
                    const result = yield toy_type_model_1.default.deleteOne({ _id: id });
                    if (result.deletedCount === 0) {
                        throw api_error_1.default.BadRequest(`Failed to delete audio file with id ${id}.`);
                    }
                    deletedCount += result.deletedCount;
                }
                return `${deletedCount} audio file(s) deleted successfully.`;
            }
            catch (error) {
                throw error;
            }
        });
    }
    searchByPriceRange(minPrice, maxPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield toy_type_model_1.default.find({
                    price: { $gte: minPrice, $lte: maxPrice }
                }).populate('supplier_id personage_obj_state_id default_scenario_id');
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new ToyTypeService();
