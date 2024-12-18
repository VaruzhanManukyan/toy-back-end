"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PersonageObjectStateModel = new mongoose_1.Schema({
    personage_object_id: {
        ref: "Personage_object",
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    description_state_ids: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Description_state' }],
    name: {
        type: String,
        required: true
    }
});
exports.default = (0, mongoose_1.model)("Personage_object_state", PersonageObjectStateModel);
