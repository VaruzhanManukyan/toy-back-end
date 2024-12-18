"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ToyTypeSchema = new mongoose_1.Schema({
    supplier_id: {
        ref: 'Supplier',
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    personage_object_state_id: {
        ref: 'Personage_object_state',
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    default_scenario_id: {
        ref: 'Scenario',
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageSrc: {
        type: String,
        default: '' // Optional field, default value if not provided
    }
});
exports.default = (0, mongoose_1.model)("Toy_type", ToyTypeSchema);
