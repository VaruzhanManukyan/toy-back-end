"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserModel = new mongoose_1.Schema({
    device_ids: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Device' }],
    scenario_ids: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Scenario' }],
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});
exports.default = (0, mongoose_1.model)("User", UserModel);
