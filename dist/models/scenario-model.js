"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ScenarioModel = new mongoose_1.Schema({
    audio_file_ids: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Audio_file' }],
    personage_object_state_ids: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Personage_object_state' }],
    name: {
        type: String,
        required: true
    }
});
exports.default = (0, mongoose_1.model)("Scenario", ScenarioModel);
