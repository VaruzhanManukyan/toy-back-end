import {Schema, model} from "mongoose";
import {IDeviceDB} from "../shared/interfaces/device-interfaces";

const DeviceModel = new Schema({
    supplier_id: {
        type: String,
        required: true
    },
    production_date: {
        type: Date,
        default: Date.now
    },
    serial_number: {
        type: String,
        required: true
    }
});

export default model<IDeviceDB>("Devices", DeviceModel);