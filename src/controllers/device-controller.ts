import {Request, Response, NextFunction} from 'express';
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IDevice, IDeviceAllResponse, IDeviceDB, IDeviceResponse} from "../shared/interfaces/device-interfaces";
import DeviceService from '../services/device-service';

class DeviceController {
    async create(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {supplier_id, serial_number} = request.body;
            if (!Types.ObjectId.isValid(supplier_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${supplier_id}`));
            }

            if (!serial_number) {
                return next(ApiError.BadRequest(`Serial number is required: ${serial_number}`));
            }

            const device: IDevice = {
                supplier_id,
                serial_number
            }

            const deviceDB: IDeviceDB = await DeviceService.create(device);
            const deviceResponse: IDeviceResponse = {
                id: deviceDB._id,
                ...deviceDB._doc
            }

            response.status(201).json(deviceResponse);
        } catch (error) {
            next(error);
        }
    }

    async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const devicesDB: IDeviceDB[] = await DeviceService.getAll();
            const devicesDBResponse: IDeviceAllResponse = {
                data: devicesDB.map((item: IDeviceDB) => ({
                    id: item._id,
                    ...item._doc
                })),
                total: devicesDB.length
            }

            response.status(200).json(devicesDBResponse);
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

            const deviceDB: IDeviceDB = await DeviceService.getById(id);
            const deviceResponse: IDeviceResponse = {
                id: deviceDB._id,
                ...deviceDB._doc
            }

            response.status(200).json(deviceResponse);
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id, supplier_id, serial_number} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            if (!Types.ObjectId.isValid(supplier_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${supplier_id}`));
            }

            const device: IDevice = {
                supplier_id,
                serial_number
            }

            const deviceDB: IDeviceDB = await DeviceService.update(id, device);
            const deviceResponse: IDeviceResponse = {
                id: deviceDB._id,
                ...deviceDB._doc
            }

            response.status(200).json(deviceResponse);
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

            const message: string = await DeviceService.delete(id);
            response.status(200).json({message});
        } catch (error) {
            next(error);
        }
    }

    async deleteMany(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {ids} = request.body;
            if (!Array.isArray(ids) || ids.some((id: string) => !Types.ObjectId.isValid(id))) {
                return next(ApiError.BadRequest(`Invalid ID format in array: ${JSON.stringify(ids)}`));
            }

            const message: string = await DeviceService.deleteMany(ids);
            response.status(200).json({message});
        } catch (error) {
            next(error);
        }
    }

    async connect(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id, user_id} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            if (!Types.ObjectId.isValid(user_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${user_id}`));
            }

            const deviceDB: IDeviceDB = await DeviceService.connect(id, user_id);
            const deviceResponse: IDeviceResponse = {
                id: deviceDB._id,
                ...deviceDB._doc
            }

            response.status(200).json(deviceResponse);
        } catch (error) {
            next(error);
        }
    }
}

export default new DeviceController();
