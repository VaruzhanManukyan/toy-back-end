import {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {
    ISupplier,
    ISupplierAllResponse,
    ISupplierDB,
    ISupplierResponse,
    ISupplierTemp
} from "../shared/interfaces/supplier-interfaces";
import SupplierService from "../services/supplier-service";

class SupplierController {
    async create(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {name, email, password, phone} = request.body;

            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            if (!email) {
                return next(ApiError.BadRequest("Email is required."));
            }

            if (!password) {
                return next(ApiError.BadRequest("Password is required."));
            }

            if (!phone) {
                return next(ApiError.BadRequest("Phone is required."));
            }

            const supplier: ISupplier = {
                name,
                email,
                password,
                phone
            }

            const supplierDB: ISupplierDB = await SupplierService.create(supplier);
            const supplierResponse: ISupplierResponse = {
                id: supplierDB._id,
                ...supplierDB._doc
            }

            response.status(201).json(supplierResponse);
        } catch (error) {
            next(error);
        }
    }

    async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const suppliersDB: ISupplierDB[] = await SupplierService.getAll();
            const suppliersResponse: ISupplierAllResponse = {
                data: suppliersDB.map((item: ISupplierDB) => ({
                    id: item._id,
                    ...item._doc
                })),
                total: suppliersDB.length
            };

            response.status(200).json(suppliersResponse);
        } catch (error) {
            next(error);
        }
    }

    async getById(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            const supplierDB: ISupplierDB = await SupplierService.getById(id);
            const supplierResponse: ISupplierResponse = {
                id: supplierDB._id,
                ...supplierDB._doc
            }

            response.status(200).json(supplierResponse)
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id, name, email, phone} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            if (!email) {
                return next(ApiError.BadRequest("Email is required."));
            }

            if (!phone) {
                return next(ApiError.BadRequest("Phone is required."));
            }

            const supplier: ISupplierTemp = {
                name,
                email,
                phone
            }

            const supplierDB: ISupplierDB = await SupplierService.update(id, supplier);
            const supplierResponse: ISupplierResponse = {
                id: supplierDB._id,
                ...supplierDB._doc
            }

            response.status(200).json(supplierResponse);
        } catch (error) {
            next(error);
        }
    }

    async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            const message: string = await SupplierService.delete(id);
            response.status(200).json({message});
        } catch (error) {
            next(error);
        }
    }

    async deleteMany(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {ids} = request.body;
            if (!Array.isArray(ids) || !ids.every(id => Types.ObjectId.isValid(id))) {
                return next(ApiError.BadRequest("Invalid ID format(s) in the request."));
            }

            const message: string = await SupplierService.deleteMany(ids);
            response.status(200).json({message});
        } catch (error) {
            next(error);
        }
    }
}

export default new SupplierController();