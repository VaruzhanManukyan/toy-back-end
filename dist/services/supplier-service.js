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
const argon2_1 = __importDefault(require("argon2"));
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const supplier_model_1 = __importDefault(require("../models/supplier-model"));
class SupplierService {
    create(supplier) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone } = supplier;
                const candidateWithName = yield supplier_model_1.default.findOne({ name });
                if (candidateWithName) {
                    throw api_error_1.default.BadRequest(`A supplier with this name ${name} already exists.`);
                }
                const candidateWithEmail = yield supplier_model_1.default.findOne({ email });
                if (candidateWithEmail) {
                    throw api_error_1.default.BadRequest(`A supplier with this email address ${email} already exists`);
                }
                const candidateWithPhone = yield supplier_model_1.default.findOne({ phone });
                if (candidateWithPhone) {
                    throw api_error_1.default.BadRequest(`A supplier with the same phone number ${phone} already exists.`);
                }
                const hashPassword = yield argon2_1.default.hash(supplier.password);
                const supplierDB = new supplier_model_1.default({
                    name: supplier.name,
                    email: supplier.email,
                    password: hashPassword,
                    phone: supplier.phone
                });
                yield supplierDB.save();
                return supplierDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const suppliersDB = yield supplier_model_1.default.find();
                return suppliersDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supplierDB = yield supplier_model_1.default.findById(id);
                if (!supplierDB) {
                    throw api_error_1.default.BadRequest(`Supplier with id ${id} not found.`);
                }
                return supplierDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, supplier) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone } = supplier;
                const candidateWithName = yield supplier_model_1.default.findOne({ name });
                if (candidateWithName && id.toString() !== candidateWithName._id.toString()) {
                    throw api_error_1.default.BadRequest(`Supplier with this name ${name} already exists.`);
                }
                const candidateWithEmail = yield supplier_model_1.default.findOne({ email });
                if (candidateWithEmail && id.toString() !== candidateWithEmail._id.toString()) {
                    throw api_error_1.default.BadRequest(`Supplier with this email address ${email} already exists`);
                }
                const candidateWithPhone = yield supplier_model_1.default.findOne({ phone });
                if (candidateWithPhone && id.toString() !== candidateWithPhone._id.toString()) {
                    throw api_error_1.default.BadRequest(`Supplier with the same phone number ${phone} already exists.`);
                }
                const supplierDB = yield supplier_model_1.default.findOneAndUpdate({ _id: id }, { $set: supplier }, { new: true });
                if (!supplierDB) {
                    throw api_error_1.default.BadRequest(`Supplier with id ${id} not found.`);
                }
                return supplierDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield supplier_model_1.default.deleteOne({ _id: id });
                if (result.deletedCount === 0) {
                    throw api_error_1.default.BadRequest(`No Supplier found for the provided IDs.`);
                }
                return `${result.deletedCount} Supplier deleted successfully.`;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteMany(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield supplier_model_1.default.deleteMany({ _id: { $in: ids } });
                if (result.deletedCount === 0) {
                    throw api_error_1.default.BadRequest(`No Suppliers found for the provided IDs.`);
                }
                return `${result.deletedCount} Suppliers deleted successfully.`;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new SupplierService();
