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
const mongoose_1 = require("mongoose");
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const publisher_model_1 = __importDefault(require("../models/publisher-model"));
const scenario_model_1 = __importDefault(require("../models/scenario-model"));
const audio_file_model_1 = __importDefault(require("../models/audio-file-model"));
const toy_model_1 = __importDefault(require("../models/toy-model"));
const toy_type_model_1 = __importDefault(require("../models/toy-type-model"));
const audio_file_service_1 = __importDefault(require("./audio-file-service"));
class ScenarioService {
    create(scenario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, publisher_id, personage_object_state_ids, audioFiles } = scenario;
                const audio_file_ids = [];
                for (const audioFile of audioFiles) {
                    const audioSrc = `undefined%${audioFile.audioSrc.split("%")[1]}`;
                    const audioFileDB = new audio_file_model_1.default({
                        name: audioFile.name,
                        audioSrc,
                    });
                    yield audioFileDB.save();
                    audio_file_ids.push(audioFileDB._id);
                }
                const candidateWithName = yield scenario_model_1.default.findOne({ name });
                if (candidateWithName) {
                    yield audio_file_service_1.default.deleteMany(audio_file_ids);
                    throw api_error_1.default.BadRequest(`Scenario with this name ${name} already exists.`);
                }
                const publisherDB = yield publisher_model_1.default.findById(publisher_id);
                if (!publisherDB) {
                    yield audio_file_service_1.default.deleteMany(audio_file_ids);
                    throw api_error_1.default.BadRequest(`Publisher with id ${publisher_id} not found.`);
                }
                const scenarioDB = new scenario_model_1.default({
                    audio_file_ids: [],
                    personage_object_state_ids,
                    name
                });
                publisherDB._doc.scenario_ids.push(scenarioDB._id);
                yield scenarioDB.save();
                yield publisherDB.save();
                const scenarioDBUpdated = yield scenario_model_1.default.findByIdAndUpdate({ _id: scenarioDB._id }, { $set: { audio_file_ids: audio_file_ids } }, { new: true });
                if (!scenarioDBUpdated) {
                    yield audio_file_service_1.default.deleteMany(audio_file_ids);
                    throw api_error_1.default.BadRequest(`Scenario with id ${scenarioDB._id} not found.`);
                }
                for (const audio_file_id of audio_file_ids) {
                    const audioFileDB = yield audio_file_model_1.default.findById(audio_file_id);
                    if (!audioFileDB) {
                        yield audio_file_service_1.default.delete(audio_file_id);
                        throw api_error_1.default.BadRequest(`Audio file with id ${audio_file_id} not found.`);
                    }
                    const audioSrc = `${scenarioDB._id}%${audioFileDB._doc.audioSrc.split("%")[1]}`;
                    yield audio_file_model_1.default.findByIdAndUpdate({ _id: audio_file_id }, { $set: { audioSrc: audioSrc } }, { new: true });
                }
                const scenarioResponse = Object.assign({ id: scenarioDB._id }, scenarioDB._doc);
                return scenarioResponse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const scenariosDB = yield scenario_model_1.default.find();
                return scenariosDB;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const scenarioDB = yield scenario_model_1.default.findById(id);
                if (!scenarioDB) {
                    throw api_error_1.default.BadRequest(`Scenario with id ${id} not found.`);
                }
                const publisherDB = yield publisher_model_1.default.findOne({ scenario_ids: id });
                const scenarioResponse = {
                    id: scenarioDB._id,
                    publisher_id: publisherDB === null || publisherDB === void 0 ? void 0 : publisherDB._id,
                    name: scenarioDB._doc.name,
                    audio_file_ids: scenarioDB._doc.audio_file_ids,
                    personage_object_state_ids: scenarioDB._doc.personage_object_state_ids,
                };
                return scenarioResponse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, scenario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const audio_file_ids_request = scenario.audio_file_ids
                    ? scenario.audio_file_ids.map(id => new mongoose_1.Types.ObjectId(id))
                    : [];
                const audioFilesRequest = [];
                let new_audio_file_ids = [];
                const candidateWithName = yield scenario_model_1.default.findOne({ name: scenario.name });
                if (candidateWithName && id.toString() !== candidateWithName._id.toString()) {
                    throw api_error_1.default.BadRequest(`Scenario with this name ${name} already exists.`);
                }
                for (const audio_file_id_request of audio_file_ids_request) {
                    const audioFileDB = yield audio_file_model_1.default.findById(audio_file_id_request);
                    if (!audioFileDB) {
                        yield audio_file_service_1.default.deleteMany(new_audio_file_ids);
                        throw api_error_1.default.BadRequest(`Scenario with id ${id} not found.`);
                    }
                    audioFilesRequest.push(audioFileDB);
                }
                for (const audioFile of scenario.audioFiles) {
                    const audioSrc = `${id}%${audioFile.audioSrc.split("%")[1]}`;
                    let isNewFile = true;
                    for (const audioFileRequest of audioFilesRequest) {
                        if (audioFileRequest._doc.audioSrc === audioSrc) {
                            isNewFile = false;
                        }
                    }
                    if (isNewFile) {
                        const audioFileDB = new audio_file_model_1.default({
                            name: audioFile.name,
                            audioSrc,
                        });
                        yield audioFileDB.save();
                        new_audio_file_ids.push(audioFileDB._id);
                    }
                }
                const scenarioDB = yield scenario_model_1.default.findById(id);
                if (!scenarioDB) {
                    yield audio_file_service_1.default.deleteMany(new_audio_file_ids);
                    throw api_error_1.default.BadRequest(`Scenario with id ${id} not found.`);
                }
                let audio_file_ids_delete = [];
                for (const audio_file_id of scenarioDB._doc.audio_file_ids) {
                    const existsInRequest = audio_file_ids_request.some(id => id.equals(audio_file_id));
                    if (!existsInRequest) {
                        audio_file_ids_delete.push(audio_file_id);
                    }
                }
                for (const audio_file_id_delete of audio_file_ids_delete) {
                    const audioFileDB = yield audio_file_model_1.default.findById(audio_file_id_delete);
                    if (!audioFileDB) {
                        yield audio_file_service_1.default.deleteMany(new_audio_file_ids);
                        throw api_error_1.default.BadRequest(`Scenario with id ${id} not found.`);
                    }
                    for (const audioFile of scenario.audioFiles) {
                        if (audioFileDB._doc.name === audioFile.name) {
                            yield audio_file_model_1.default.deleteOne({ _id: audio_file_id_delete });
                            audio_file_ids_delete = audio_file_ids_delete.filter((id) => id !== audio_file_id_delete);
                        }
                    }
                }
                yield audio_file_service_1.default.deleteMany(audio_file_ids_delete);
                for (const audio_file_id of new_audio_file_ids) {
                    const audioFile = yield audio_file_model_1.default.findById(audio_file_id);
                    if (!audioFile) {
                        new_audio_file_ids = new_audio_file_ids.filter((item) => item !== audio_file_id);
                        yield scenario_model_1.default.findByIdAndUpdate({ _id: id }, { $set: { audio_file_ids: new_audio_file_ids } }, { new: true });
                    }
                }
                const scenarioForUpdate = {
                    name: scenario.name,
                    audio_file_ids: [...audio_file_ids_request, ...new_audio_file_ids],
                    personage_object_state_ids: scenario.personage_object_state_ids,
                };
                const scenarioDBUpdated = yield scenario_model_1.default.findByIdAndUpdate({ _id: id }, { $set: scenarioForUpdate }, { new: true });
                if (!scenarioDBUpdated) {
                    yield audio_file_service_1.default.deleteMany(new_audio_file_ids);
                    throw api_error_1.default.BadRequest(`Scenario with id ${id} not found.`);
                }
                const publisherDB = yield publisher_model_1.default.findOne({ scenario_ids: id });
                if (!publisherDB) {
                    yield audio_file_service_1.default.deleteMany(new_audio_file_ids);
                    throw api_error_1.default.BadRequest(`Publisher not found for scenario with id ${id}.`);
                }
                const scenarioResponse = {
                    id: scenarioDBUpdated._id,
                    publisher_id: publisherDB._id,
                    name: scenarioDBUpdated._doc.name,
                    audio_file_ids: scenarioDBUpdated._doc.audio_file_ids,
                    personage_object_state_ids: scenarioDBUpdated._doc.personage_object_state_ids,
                };
                return scenarioResponse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const toyTypeDB = yield toy_type_model_1.default.findOne({ default_scenario_id: id });
                if (toyTypeDB) {
                    throw api_error_1.default.BadRequest(`There is a toy type with this default scenario with id ${id}.`);
                }
                const scenarioDB = yield scenario_model_1.default.findByIdAndDelete(id);
                if (!scenarioDB) {
                    throw api_error_1.default.BadRequest(`Scenario with id ${id} not found.`);
                }
                yield publisher_model_1.default.updateMany({ scenario_ids: id }, { $pull: { scenario_ids: id } });
                yield audio_file_service_1.default.deleteMany(scenarioDB._doc.audio_file_ids);
                return "Scenario and associated audio files have been deleted.";
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteMany(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const toyTypeDB = yield toy_type_model_1.default.findOne({ default_scenario_id: { $in: ids } });
                if (toyTypeDB) {
                    throw api_error_1.default.BadRequest(`One or more scenarios are set as the default scenario for a toy type.`);
                }
                const scenariosDB = yield scenario_model_1.default.find({ _id: { $in: ids } });
                if (scenariosDB.length === 0) {
                    throw api_error_1.default.BadRequest("No scenarios found with the provided IDs.");
                }
                const audioFileIds = scenariosDB.flatMap((scenario) => scenario._doc.audio_file_ids);
                yield audio_file_service_1.default.deleteMany(audioFileIds);
                const result = yield scenario_model_1.default.deleteMany({ _id: { $in: ids } });
                yield publisher_model_1.default.updateMany({ relatedField: { $in: ids } }, { $pull: { relatedField: { $in: ids } } });
                if (result.deletedCount === 0) {
                    throw api_error_1.default.BadRequest("Failed to delete documents with the provided IDs.");
                }
                return `${result.deletedCount} document(s) and associated files have been deleted successfully.`;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMediaFileIds(RFID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const toy = yield toy_model_1.default.findOne({ RFID });
                if (!toy) {
                    throw api_error_1.default.NotFound("There are no toys with this RFID.");
                }
                const toyType = yield toy_type_model_1.default.findById(toy._doc.toy_type_id);
                if (!toyType) {
                    throw api_error_1.default.NotFound(`ToyType with id ${toy._doc.toy_type_id} not found.`);
                }
                const scenario = yield scenario_model_1.default.findById(toyType._doc.default_scenario_id);
                if (!scenario) {
                    throw api_error_1.default.NotFound(`Scenario with id ${toyType._doc.default_scenario_id} not found.`);
                }
                const audio_file_ids = scenario._doc.audio_file_ids;
                for (const audio_file_id of audio_file_ids) {
                    const audioFile = yield audio_file_model_1.default.findById(audio_file_id);
                    if (!audioFile) {
                        throw api_error_1.default.NotFound(`Audio file with id ${audio_file_id} not found.`);
                    }
                }
                return audio_file_ids;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new ScenarioService();
