import argon2 from "argon2";
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {ISupplier, ISupplierDB, ISupplierTemp} from "../shared/interfaces/supplier-interfaces";
import SupplierModel from "../models/supplier-model";

class SupplierService {
    async create(supplier: ISupplier): Promise<ISupplierDB> {
        try {
            const {name, email, phone} = supplier;

            const candidateWithName = await SupplierModel.findOne({name});
            if (candidateWithName) {
                throw ApiError.BadRequest(`A supplier with this name ${name} already exists.`);
            }

            const candidateWithEmail = await SupplierModel.findOne({email});
            if (candidateWithEmail) {
                throw ApiError.BadRequest(`A supplier with this email address ${email} already exists`);
            }

            const candidateWithPhone = await SupplierModel.findOne({phone});
            if (candidateWithPhone) {
                throw ApiError.BadRequest(`A supplier with the same phone number ${phone} already exists.`);
            }

            const hashPassword: string = await argon2.hash(supplier.password);
            const supplierDB = new SupplierModel({
                name: supplier.name,
                email: supplier.email,
                password: hashPassword,
                phone: supplier.phone
            });

            await supplierDB.save();
            return supplierDB;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<ISupplierDB[]> {
        try {
            const suppliersDB: ISupplierDB[] = await SupplierModel.find();
            return suppliersDB;
        } catch (error) {
            throw error;
        }
    }

    async getById(id: Types.ObjectId): Promise<ISupplierDB> {
        try {
            const supplierDB: ISupplierDB | null =  await SupplierModel.findById(id);
            if (!supplierDB) {
                throw ApiError.BadRequest(`Supplier with id ${id} not found.`);
            }
            return supplierDB;
        } catch (error) {
            throw error;
        }
    }

    async update(id: Types.ObjectId, supplier: ISupplierTemp): Promise<ISupplierDB> {
        try {
            const {name, email, phone} = supplier;

            const candidateWithName: ISupplierDB | null = await SupplierModel.findOne({name});
            if (candidateWithName && id.toString() !== candidateWithName._id.toString()) {
                throw ApiError.BadRequest(`Supplier with this name ${name} already exists.`);
            }

            const candidateWithEmail: ISupplierDB | null = await SupplierModel.findOne({email});
            if (candidateWithEmail && id.toString() !== candidateWithEmail._id.toString()) {
                throw ApiError.BadRequest(`Supplier with this email address ${email} already exists`);
            }

            const candidateWithPhone: ISupplierDB | null = await SupplierModel.findOne({phone});
            if (candidateWithPhone && id.toString() !== candidateWithPhone._id.toString()) {
                throw ApiError.BadRequest(`Supplier with the same phone number ${phone} already exists.`);
            }

            const supplierDB: ISupplierDB | null = await SupplierModel.findOneAndUpdate(
                {_id: id},
                {$set: supplier},
                {new: true}
            );
            if (!supplierDB) {
                throw ApiError.BadRequest(`Supplier with id ${id} not found.`);
            }
            return supplierDB;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: Types.ObjectId) {
        try {
            const result = await SupplierModel.deleteOne({_id: id});
            if (result.deletedCount === 0) {
                throw ApiError.BadRequest(`No Supplier found for the provided IDs.`);
            }
            return `${result.deletedCount} Supplier deleted successfully.`;
        } catch (error) {
            throw error;
        }
    }

    async deleteMany(ids: Types.ObjectId[]): Promise<string> {
        try {
            const result = await SupplierModel.deleteMany({_id: {$in: ids}});
            if (result.deletedCount === 0) {
                throw ApiError.BadRequest(`No Suppliers found for the provided IDs.`);
            }
            return `${result.deletedCount} Suppliers deleted successfully.`;
        } catch (error) {
            throw error;
        }
    }
}

export default new SupplierService();