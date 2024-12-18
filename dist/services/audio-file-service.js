"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = require("mongoose");
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const audio_file_model_1 = __importDefault(require("../models/audio-file-model"));
const scenario_model_1 = __importDefault(require("../models/scenario-model"));
class AudioFileService {
    create(audioFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const audioFileDB = new audio_file_model_1.default(audioFile);
                yield audioFileDB.save();
                const newPath = `${audioFileDB._id}%${audioFileDB._doc.audioSrc.split("%")[1]}`;
                fs_1.default.renameSync(`uploads-audio\\${audioFileDB._doc.audioSrc}`, `uploads-audio\\${newPath}`);
                const audioFileDBUpdated = yield audio_file_model_1.default.findOneAndUpdate({ _id: audioFileDB._id }, { $set: { audioSrc: newPath } }, { new: true });
                if (!audioFileDBUpdated) {
                    throw api_error_1.default.BadRequest(`Audio file with id ${audioFileDB._id} not found.`);
                }
                return audioFileDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const audioFilesDB = yield audio_file_model_1.default.find();
                return audioFilesDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getFilteredAudioFiles(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Array.isArray(ids) || !ids.every(id => mongoose_1.Types.ObjectId.isValid(id))) {
                    throw api_error_1.default.BadRequest("Invalid ID format(s) in the request.");
                }
                const audioFilesDB = [];
                for (const id of ids) {
                    const audioFileDB = yield audio_file_model_1.default.findById(id);
                    if (!audioFileDB) {
                        throw api_error_1.default.BadRequest(`Audio file with id ${id} not found.`);
                    }
                    audioFilesDB.push(audioFileDB);
                }
                return audioFilesDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const audioFileDB = yield audio_file_model_1.default.findById(id);
                if (!audioFileDB) {
                    throw api_error_1.default.BadRequest(`Audio file with id ${id} not found.`);
                }
                const scenarioDB = yield scenario_model_1.default.findOne({ audio_file_ids: { $in: [id] } });
                audioFileDB.scenario_id = scenarioDB ? scenarioDB._id : undefined;
                return audioFileDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, audioFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const audioFileDB = yield audio_file_model_1.default.findById(id);
                if (!audioFileDB) {
                    throw api_error_1.default.BadRequest(`Audio file with id ${id} not found.`);
                }
                if (audioFileDB._doc.audioSrc !== audioFile.audioSrc) {
                    const filePath = path_1.default.resolve(`uploads-audio\\${audioFileDB._doc.audioSrc}`);
                    fs_1.default.unlink(filePath, (error) => {
                        if (error) {
                            console.error(`Failed to delete file ${filePath}: ${error.message}`);
                        }
                    });
                    const audioFileDBUpdated = yield audio_file_model_1.default.findOneAndUpdate({ _id: id }, { $set: audioFile }, { new: true });
                    if (!audioFileDBUpdated) {
                        throw api_error_1.default.BadRequest(`Audio file with id ${id} not found.`);
                    }
                    return audioFileDBUpdated;
                }
                else {
                    return audioFileDB;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const audioFileDB = yield audio_file_model_1.default.findById(id);
                if (!audioFileDB) {
                    throw api_error_1.default.BadRequest(`Audio file with id ${id} not found.`);
                }
                yield scenario_model_1.default.updateMany({ audio_file_ids: id }, { $pull: { audio_file_ids: id } });
                const filePath = path_1.default.resolve(`uploads-audio\\${audioFileDB._doc.audioSrc}`);
                fs_1.default.unlink(filePath, (error) => {
                    if (error) {
                        console.error(`Failed to delete file ${filePath}: ${error.message}`);
                    }
                });
                const result = yield audio_file_model_1.default.deleteOne({ _id: id });
                if (result.deletedCount === 0) {
                    throw api_error_1.default.BadRequest(`Audio file with id ${id} not found.`);
                }
                return "Audio file is deleted";
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteMany(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let deletedCount = 0;
                for (const id of ids) {
                    const audioFileDB = yield audio_file_model_1.default.findById(id);
                    if (!audioFileDB) {
                        throw api_error_1.default.BadRequest(`Audio file with id ${id} not found.`);
                    }
                    yield scenario_model_1.default.updateMany({ audio_file_ids: id }, { $pull: { audio_file_ids: id } });
                    const filePath = path_1.default.resolve(`uploads-audio\\${audioFileDB._doc.audioSrc}`);
                    fs_1.default.unlink(filePath, (error) => {
                        if (error) {
                            console.error(`Failed to delete file ${filePath}: ${error.message}`);
                        }
                    });
                    const result = yield audio_file_model_1.default.deleteOne({ _id: id });
                    if (result.deletedCount === 0) {
                        throw api_error_1.default.BadRequest(`Failed to delete audio file with id ${id}.`);
                    }
                    deletedCount += result.deletedCount;
                }
                return `${deletedCount} audio file(s) deleted successfully.`;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new AudioFileService();
