"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ToyModel = new mongoose_1.Schema({
    toy_type_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    RFID: {
        type: String,
        required: true
    }
});
exports.default = (0, mongoose_1.model)("Toy", ToyModel);
