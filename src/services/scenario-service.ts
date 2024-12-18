import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IAudioFileDB} from "../shared/interfaces/audio-file-interfaces";
import {IScenario, IScenarioDB, IScenarioResponse, ITempScenarioCreate, ITempScenarioUpdate} from "../shared/interfaces/scenario-interfaces";
import {IToyTypeDB} from "../shared/interfaces/toy-type-interfaces";
import PublisherModel from "../models/publisher-model";
import ScenarioModel from "../models/scenario-model";
import AudioFileModel from "../models/audio-file-model";
import ToyModel from "../models/toy-model";
import ToyTypeModel from "../models/toy-type-model";
import AudioFileService from "./audio-file-service";

class ScenarioService {
    async create(scenario: ITempScenarioCreate): Promise<IScenarioResponse> {
        try {
            const {name, publisher_id, personage_object_state_ids, audioFiles} = scenario;
            const audio_file_ids: Types.ObjectId[] = [];
            for (const audioFile of audioFiles) {
                const audioSrc = `undefined%${audioFile.audioSrc.split("%")[1]}`;
                const audioFileDB = new AudioFileModel({
                    name: audioFile.name,
                    audioSrc,
                });
                await audioFileDB.save();
                audio_file_ids.push(audioFileDB._id);
            }

            const candidateWithName: IAudioFileDB | null = await ScenarioModel.findOne({name});
            if (candidateWithName) {
                await AudioFileService.deleteMany(audio_file_ids);
                throw ApiError.BadRequest(`Scenario with this name ${name} already exists.`);
            }

            const publisherDB = await PublisherModel.findById(publisher_id);
            if (!publisherDB) {
                await AudioFileService.deleteMany(audio_file_ids);
                throw ApiError.BadRequest(`Publisher with id ${publisher_id} not found.`);
            }

            const scenarioDB = new ScenarioModel({
                audio_file_ids: [],
                personage_object_state_ids,
                name
            });

            publisherDB._doc.scenario_ids.push(scenarioDB._id);
            await scenarioDB.save();
            await publisherDB.save();

            const scenarioDBUpdated: IScenarioDB | null = await ScenarioModel.findByIdAndUpdate(
                {_id: scenarioDB._id},
                {$set: {audio_file_ids: audio_file_ids}},
                {new: true}
            );

            if (!scenarioDBUpdated) {
                await AudioFileService.deleteMany(audio_file_ids);
                throw ApiError.BadRequest(`Scenario with id ${scenarioDB._id} not found.`);
            }

            for (const audio_file_id of audio_file_ids) {
                const audioFileDB = await AudioFileModel.findById(audio_file_id);
                if (!audioFileDB) {
                    await AudioFileService.delete(audio_file_id);
                    throw ApiError.BadRequest(`Audio file with id ${audio_file_id} not found.`);
                }
                const audioSrc = `${scenarioDB._id}%${audioFileDB._doc.audioSrc.split("%")[1]}`;
                await AudioFileModel.findByIdAndUpdate(
                    {_id: audio_file_id},
                    {$set: {audioSrc: audioSrc}},
                    {new: true}
                );
            }

            const scenarioResponse: IScenarioResponse = {
                id: scenarioDB._id,
                ...scenarioDB._doc
            };

            return scenarioResponse;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<IScenarioDB[]> {
        try {
            const scenariosDB: IScenarioDB[] = await ScenarioModel.find();
            return scenariosDB;
        } catch (error) {
            throw error;
        }
    }

    async getById(id: Types.ObjectId): Promise<IScenarioResponse> {
        try {
            const scenarioDB: IScenarioDB | null = await ScenarioModel.findById(id);
            if (!scenarioDB) {
                throw ApiError.BadRequest(`Scenario with id ${id} not found.`);
            }

            const publisherDB = await PublisherModel.findOne({scenario_ids: id});

            const scenarioResponse: IScenarioResponse = {
                id: scenarioDB._id,
                publisher_id: publisherDB?._id,
                name: scenarioDB._doc.name,
                audio_file_ids: scenarioDB._doc.audio_file_ids,
                personage_object_state_ids: scenarioDB._doc.personage_object_state_ids,
            };

            return scenarioResponse;
        } catch (error) {
            throw error;
        }
    }

    async update(id: Types.ObjectId, scenario: ITempScenarioUpdate): Promise<IScenarioResponse> {
        try {
            const audio_file_ids_request: Types.ObjectId[] = scenario.audio_file_ids
                ? scenario.audio_file_ids.map(id => new Types.ObjectId(id))
                : [];
            const audioFilesRequest: IAudioFileDB[] = [];
            let new_audio_file_ids: Types.ObjectId[] = [];

            const candidateWithName: IAudioFileDB | null = await ScenarioModel.findOne({name: scenario.name});
            if (candidateWithName && id.toString() !== candidateWithName._id.toString()) {
                throw ApiError.BadRequest(`Scenario with this name ${name} already exists.`);
            }

            for (const audio_file_id_request of audio_file_ids_request) {
                const audioFileDB: IAudioFileDB | null = await AudioFileModel.findById(audio_file_id_request);
                if (!audioFileDB) {
                    await AudioFileService.deleteMany(new_audio_file_ids);
                    throw ApiError.BadRequest(`Scenario with id ${id} not found.`);
                }
                audioFilesRequest.push(audioFileDB);
            }

            for (const audioFile of scenario.audioFiles) {
                const audioSrc: string = `${id}%${audioFile.audioSrc.split("%")[1]}`;
                let isNewFile: boolean = true;

                for (const audioFileRequest of audioFilesRequest) {
                    if (audioFileRequest._doc.audioSrc === audioSrc) {
                        isNewFile = false;
                    }
                }

                if (isNewFile) {
                    const audioFileDB = new AudioFileModel({
                        name: audioFile.name,
                        audioSrc,
                    });
                    await audioFileDB.save();
                    new_audio_file_ids.push(audioFileDB._id);
                }
            }

            const scenarioDB: IScenarioDB | null = await ScenarioModel.findById(id);

            if (!scenarioDB) {
                await AudioFileService.deleteMany(new_audio_file_ids);
                throw ApiError.BadRequest(`Scenario with id ${id} not found.`);
            }

            let audio_file_ids_delete: Types.ObjectId[] = [];

            for (const audio_file_id of scenarioDB._doc.audio_file_ids) {
                const existsInRequest = audio_file_ids_request.some(id => id.equals(audio_file_id));
                if (!existsInRequest) {
                    audio_file_ids_delete.push(audio_file_id);
                }
            }

            for (const audio_file_id_delete of audio_file_ids_delete) {
                const audioFileDB: IAudioFileDB | null = await AudioFileModel.findById(audio_file_id_delete);
                if (!audioFileDB) {
                    await AudioFileService.deleteMany(new_audio_file_ids);
                    throw ApiError.BadRequest(`Scenario with id ${id} not found.`);
                }

                for (const audioFile of scenario.audioFiles) {
                    if (audioFileDB._doc.name === audioFile.name) {
                        await AudioFileModel.deleteOne({_id: audio_file_id_delete});
                        audio_file_ids_delete = audio_file_ids_delete.filter((id) => id !== audio_file_id_delete);
                    }
                }
            }

            await AudioFileService.deleteMany(audio_file_ids_delete);

            for (const audio_file_id of new_audio_file_ids) {
                const audioFile: IAudioFileDB | null = await AudioFileModel.findById(audio_file_id);
                if (!audioFile) {
                    new_audio_file_ids = new_audio_file_ids.filter((item) => item !== audio_file_id);
                    await ScenarioModel.findByIdAndUpdate(
                        {_id: id},
                        {$set: {audio_file_ids: new_audio_file_ids}},
                        {new: true}
                    );
                }
            }

            const scenarioForUpdate: IScenario = {
                name: scenario.name,
                audio_file_ids: [...audio_file_ids_request, ...new_audio_file_ids],
                personage_object_state_ids: scenario.personage_object_state_ids,
            }

            const scenarioDBUpdated: IScenarioDB | null = await ScenarioModel.findByIdAndUpdate(
                {_id: id},
                {$set: scenarioForUpdate},
                {new: true}
            );

            if (!scenarioDBUpdated) {
                await AudioFileService.deleteMany(new_audio_file_ids);
                throw ApiError.BadRequest(`Scenario with id ${id} not found.`);
            }

            const publisherDB = await PublisherModel.findOne({scenario_ids: id});

            if (!publisherDB) {
                await AudioFileService.deleteMany(new_audio_file_ids);
                throw ApiError.BadRequest(`Publisher not found for scenario with id ${id}.`);
            }

            const scenarioResponse: IScenarioResponse = {
                id: scenarioDBUpdated._id,
                publisher_id: publisherDB._id,
                name: scenarioDBUpdated._doc.name,
                audio_file_ids: scenarioDBUpdated._doc.audio_file_ids,
                personage_object_state_ids: scenarioDBUpdated._doc.personage_object_state_ids,
            };

            return scenarioResponse;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: Types.ObjectId): Promise<string> {
        try {
            const toyTypeDB: IToyTypeDB | null = await ToyTypeModel.findOne({default_scenario_id: id});
            if (toyTypeDB) {
                throw ApiError.BadRequest(`There is a toy type with this default scenario with id ${id}.`);
            }

            const scenarioDB: IScenarioDB | null = await ScenarioModel.findByIdAndDelete(id);
            if (!scenarioDB) {
                throw ApiError.BadRequest(`Scenario with id ${id} not found.`);
            }

            await PublisherModel.updateMany(
                {scenario_ids: id},
                {$pull: {scenario_ids: id}}
            );

            await AudioFileService.deleteMany(scenarioDB._doc.audio_file_ids);

            return "Scenario and associated audio files have been deleted.";
        } catch (error) {
            throw error;
        }
    }

    async deleteMany(ids: Types.ObjectId[]): Promise<string> {
        try {
            const toyTypeDB: IToyTypeDB | null = await ToyTypeModel.findOne({default_scenario_id: {$in: ids}});
            if (toyTypeDB) {
                throw ApiError.BadRequest(`One or more scenarios are set as the default scenario for a toy type.`);
            }

            const scenariosDB: IScenarioDB[] | null = await ScenarioModel.find({_id: {$in: ids}});

            if (scenariosDB.length === 0) {
                throw ApiError.BadRequest("No scenarios found with the provided IDs.");
            }

            const audioFileIds: Types.ObjectId[] = scenariosDB.flatMap((scenario: IScenarioDB) => scenario._doc.audio_file_ids);

            await AudioFileService.deleteMany(audioFileIds);

            const result = await ScenarioModel.deleteMany({_id: {$in: ids}});

            await PublisherModel.updateMany(
                {relatedField: {$in: ids}},
                {$pull: {relatedField: {$in: ids}}}
            );

            if (result.deletedCount === 0) {
                throw ApiError.BadRequest("Failed to delete documents with the provided IDs.");
            }

            return `${result.deletedCount} document(s) and associated files have been deleted successfully.`;
        } catch (error) {
            throw error;
        }
    }

    async getMediaFileIds(RFID: string): Promise<Types.ObjectId[]> {
        try {
            const toy = await ToyModel.findOne({RFID});
            if (!toy) {
                throw ApiError.NotFound("There are no toys with this RFID.");
            }

            const toyType: IToyTypeDB | null = await ToyTypeModel.findById(toy._doc.toy_type_id);
            if (!toyType) {
                throw ApiError.NotFound(`ToyType with id ${toy._doc.toy_type_id} not found.`);
            }

            const scenario: IScenarioDB | null = await ScenarioModel.findById(toyType._doc.default_scenario_id);
            if (!scenario) {
                throw ApiError.NotFound(`Scenario with id ${toyType._doc.default_scenario_id} not found.`);
            }

            const audio_file_ids: Types.ObjectId[] = scenario._doc.audio_file_ids;
            for (const audio_file_id of audio_file_ids) {
                const audioFile = await AudioFileModel.findById(audio_file_id);
                if (!audioFile) {
                    throw ApiError.NotFound(`Audio file with id ${audio_file_id} not found.`);
                }
            }

            return audio_file_ids;
        } catch (error) {
            throw error;
        }
    }
}

export default new ScenarioService();