import {Types} from "mongoose";
import ApiError from '../exceptions/api-error';
import {IDevice, IDeviceDB} from "../shared/interfaces/device-interfaces";
import DeviceModel from '../models/device-model';
import UserModeL from "../models/user-model";

class DeviceService {
    async create(device: IDevice): Promise<IDeviceDB> {
        try {
            const {serial_number} = device;
            const candidateWithSerialNumber: IDeviceDB | null = await DeviceModel.findOne({serial_number});
            if (candidateWithSerialNumber) {
                throw ApiError.BadRequest(`Device with this serial number ${serial_number} already exists.`);
            }

            const deviceDB = new DeviceModel(device);
            await deviceDB.save();
            return deviceDB;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<IDeviceDB[]> {
        try {
            const devicesDB: IDeviceDB[] = await DeviceModel.find();
            return devicesDB;
        } catch (error) {
            throw error;
        }
    }

    async getById(id: Types.ObjectId): Promise<IDeviceDB> {
        try {
            const deviceDB: IDeviceDB | null = await DeviceModel.findById(id);
            if (!deviceDB) {
                throw ApiError.BadRequest(`Device with id ${id} not found.`);
            }
            return deviceDB;
        } catch (error) {
            throw error;
        }
    }

    async update(id: Types.ObjectId, device: IDevice): Promise<IDeviceDB> {
        try {
            const {serial_number} = device;
            const candidateWithSerialNumber: IDeviceDB | null = await DeviceModel.findOne({serial_number});
            if (candidateWithSerialNumber && id.toString() !== candidateWithSerialNumber._id.toString()) {
                throw ApiError.BadRequest(`Device with this serial number ${serial_number} already exists.`);
            }


            const deviceDB: IDeviceDB | null = await DeviceModel.findByIdAndUpdate(
                {_id: id},
                {$set: device},
                {new: true}
            );
            if (!deviceDB) {
                throw ApiError.BadRequest(`Device with id ${id} not found.`);
            }
            return deviceDB;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: Types.ObjectId): Promise<string> {
        try {
            const device: IDeviceDB | null = await DeviceModel.findByIdAndDelete(id);
            if (!device) {
                throw ApiError.BadRequest(`Device with id ${id} not found.`);
            }
            return 'Device has been deleted.';
        } catch (error) {
            throw error;
        }
    }

    async deleteMany(ids: Types.ObjectId[]): Promise<string> {
        const result = await DeviceModel.deleteMany({ _id: { $in: ids } });
        if (result.deletedCount === 0) {
            throw ApiError.NotFound(`No devices found for the provided IDs.`);
        }
        return `${result.deletedCount} devices deleted.`;
    }

    async connect(id: string, userId: string) {
        if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
            throw ApiError.BadRequest(`Invalid id(s) ${id}, ${userId}.`);
        }

        const device = await DeviceModel.findById(id);
        if (!device) {
            throw ApiError.BadRequest(`Device with id ${id} not found.`);
        }

        const user = await UserModeL.findById(userId);
        if (!user) {
            throw ApiError.BadRequest(`User with id ${userId} not found.`);
        }

        const deviceObjectId = new Types.ObjectId(id);
        if (!user._doc.device_ids.includes(deviceObjectId)) {
            user._doc.device_ids.push(deviceObjectId);
            await user.save();
        }
        return device;
    }
}

export default new DeviceService();
