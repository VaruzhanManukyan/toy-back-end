import {Types} from "mongoose";

export interface IDevice {
    supplier_id: Types.ObjectId;
    production_date?: Date;
    serial_number: string;
}

export interface IDeviceDB {
    _id: Types.ObjectId;
    _doc: IDevice;
}

export interface IDeviceResponse extends IDevice {
    id: Types.ObjectId;
}

export interface IDeviceAllResponse {
    data: IDevice[];
    total: number;
}