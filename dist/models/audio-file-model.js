"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AudioFileModel = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    audioSrc: {
        type: String,
        required: true
    }
});
exports.default = (0, mongoose_1.model)("Audio_file", AudioFileModel);
