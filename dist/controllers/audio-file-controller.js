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
const path_1 = __importDefault(require("path"));
const mongoose_1 = require("mongoose");
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const audio_file_service_1 = __importDefault(require("../services/audio-file-service"));
class AudioFileController {
    create(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const audioFileRequest = request.file;
                console.log(audioFileRequest);
                const { originalname: name, path: audioSrc } = audioFileRequest;
                if (!name) {
                    return next(api_error_1.default.BadRequest("Name is required."));
                }
                if (!audioSrc) {
                    return next(api_error_1.default.BadRequest("Audio src is required."));
                }
                const audioFile = {
                    name,
                    audioSrc: audioSrc.split("\\")[1]
                };
                const audioFileDB = yield audio_file_service_1.default.create(audioFile);
                const audioFileResponse = Object.assign({ id: audioFileDB._id }, audioFileDB._doc);
                response.status(201).json(audioFileResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAll(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const audioFilesDB = yield audio_file_service_1.default.getAll();
                const audioFilesResponse = {
                    data: audioFilesDB.map((item) => (Object.assign({ id: item._id }, item._doc))),
                    total: audioFilesDB.length
                };
                response.status(200).json(audioFilesResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getFilteredAudioFiles(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ids } = request.body;
                if (!Array.isArray(ids) || !ids.every(id => mongoose_1.Types.ObjectId.isValid(id))) {
                    return next(api_error_1.default.BadRequest("Invalid ID format(s) in the request."));
                }
                const audioFilesDB = yield audio_file_service_1.default.getFilteredAudioFiles(ids);
                const audioFilesResponse = {
                    data: audioFilesDB.map((item) => (Object.assign({ id: item._id }, item._doc))),
                    total: audioFilesDB.length
                };
                response.status(200).json(audioFilesResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                const audioFileDB = yield audio_file_service_1.default.getById(id);
                const audioFileResponse = Object.assign({ id: audioFileDB._id, scenario_id: audioFileDB.scenario_id }, audioFileDB._doc);
                response.status(200).json(audioFileResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                const audioFileRequest = request.file;
                const { originalname: name, path: audioSrc } = audioFileRequest;
                if (!name) {
                    return next(api_error_1.default.BadRequest("Name is required."));
                }
                if (!audioSrc) {
                    return next(api_error_1.default.BadRequest("Audio src is required."));
                }
                const audioFile = {
                    name: audioFileRequest.originalname,
                    audioSrc: audioFileRequest.path.split("\\")[1]
                };
                const audioFileDBUpdate = yield audio_file_service_1.default.update(id, audioFile);
                const audioFileResponse = Object.assign({ id: audioFileDBUpdate._id }, audioFileDBUpdate._doc);
                response.status(200).json(audioFileResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    delete(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                const message = yield audio_file_service_1.default.delete(id);
                response.status(200).json(message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteMany(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ids } = request.body;
                if (!Array.isArray(ids) || !ids.every(id => mongoose_1.Types.ObjectId.isValid(id))) {
                    return next(api_error_1.default.BadRequest("Invalid ID format(s) in the request."));
                }
                const message = yield audio_file_service_1.default.deleteMany(ids);
                response.status(200).json(message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getToyMedia(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { audio_file_id } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(audio_file_id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${audio_file_id}`));
                }
                const audioFile = yield audio_file_service_1.default.getById(audio_file_id);
                const filePath = path_1.default.resolve(`uploads-audio\\${audioFile._doc.audioSrc}`);
                response.download(filePath, audioFile._doc.name, (error) => {
                    if (error) {
                        next(error);
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new AudioFileController();
