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
const scenario_service_1 = __importDefault(require("../services/scenario-service"));
class ScenarioController {
    create(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, publisher_id, personage_object_state_ids } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(publisher_id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${publisher_id}`));
                }
                if (!Array.isArray(personage_object_state_ids) || !personage_object_state_ids.every(id => mongoose_1.Types.ObjectId.isValid(id))) {
                    return next(api_error_1.default.BadRequest("Invalid ID format(s) in the request."));
                }
                if (!name) {
                    return next(api_error_1.default.BadRequest("Name is required."));
                }
                const audioFilesRequest = request.files;
                const audioFiles = [];
                for (const audioFileRequest of audioFilesRequest) {
                    const { originalname: fileName, path: audioSrc } = audioFileRequest;
                    if (!fileName || !audioSrc) {
                        return next(api_error_1.default.BadRequest("File name and audio source are required."));
                    }
                    audioFiles.push({
                        name: fileName,
                        audioSrc,
                    });
                }
                const scenarioData = {
                    name,
                    audioFiles,
                    personage_object_state_ids,
                    publisher_id,
                };
                const scenarioResponse = yield scenario_service_1.default.create(scenarioData);
                if (audioFilesRequest.length > 0) {
                    for (const uploadedFile of audioFilesRequest) {
                        const scenarioId = scenarioResponse.id;
                        const newFileName = `${scenarioId}%${uploadedFile.originalname}`;
                        const newPath = path_1.default.join("uploads-audio", newFileName);
                        fs_1.default.renameSync(uploadedFile.path, newPath);
                    }
                }
                response.status(201).json(scenarioResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAll(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const scenariosDB = yield scenario_service_1.default.getAll();
                const scenarioAllResponse = {
                    data: scenariosDB.map((item) => ({
                        id: item._id,
                        personage_object_state_ids: item._doc.personage_object_state_ids.map((id) => id),
                        audio_file_ids: item._doc.audio_file_ids.map((id) => id),
                        name: item._doc.name,
                    })),
                    total: scenariosDB.length
                };
                response.status(200).json(scenarioAllResponse);
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
                const scenarioResponse = yield scenario_service_1.default.getById(id);
                response.status(200).json(scenarioResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, id, personage_object_state_ids, audio_file_ids } = request.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return next(api_error_1.default.BadRequest(`Invalid ID format: ${id}`));
                }
                if (!Array.isArray(personage_object_state_ids) || !personage_object_state_ids.every(id => mongoose_1.Types.ObjectId.isValid(id))) {
                    return next(api_error_1.default.BadRequest("Invalid ID format(s) in the request."));
                }
                if (!name) {
                    return next(api_error_1.default.BadRequest("Name is required."));
                }
                const audioFilesRequest = request.files;
                const audioFiles = [];
                if (audioFilesRequest) {
                    for (const audioFileRequest of audioFilesRequest) {
                        const { originalname: name, path: audioSrc } = audioFileRequest;
                        if (!name) {
                            return next(api_error_1.default.BadRequest("Name is required."));
                        }
                        if (!audioSrc) {
                            return next(api_error_1.default.BadRequest("Audio src is required."));
                        }
                        audioFiles.push({
                            name,
                            audioSrc
                        });
                    }
                }
                const scenario = {
                    name, audioFiles, personage_object_state_ids, audio_file_ids
                };
                const scenarioResponse = yield scenario_service_1.default.update(id, scenario);
                response.status(200).json(scenarioResponse);
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
                const message = yield scenario_service_1.default.delete(id);
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
                const idObjects = ids.map(id => new mongoose_1.Types.ObjectId(id));
                const message = yield scenario_service_1.default.deleteMany(idObjects);
                response.status(200).json(message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getMediaFileIds(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { RFID } = request.body;
                const audio_file_ids = yield scenario_service_1.default.getMediaFileIds(RFID);
                response.status(200).json(audio_file_ids);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new ScenarioController();
