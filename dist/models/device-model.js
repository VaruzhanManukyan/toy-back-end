"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DeviceModel = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)("Devices", DeviceModel);
