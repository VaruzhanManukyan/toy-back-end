"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PublisherModel = new mongoose_1.Schema({
    scenario_ids: [{ type: mongoose_1.Types.ObjectId, ref: 'Scenario' }],
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
});
exports.default = (0, mongoose_1.model)("Publisher", PublisherModel);
