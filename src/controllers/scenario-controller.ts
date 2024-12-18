import fs from "fs";
import path from "path";
import {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IScenarioAllResponse, IScenarioDB, IScenarioResponse, ITempScenarioCreate, ITempScenarioUpdate} from "../shared/interfaces/scenario-interfaces";
import {IAudioFile} from "../shared/interfaces/audio-file-interfaces";
import ScenarioService from "../services/scenario-service";

class ScenarioController {
    async create(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {name, publisher_id, personage_object_state_ids} = request.body;

            if (!Types.ObjectId.isValid(publisher_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${publisher_id}`));
            }

            if (!Array.isArray(personage_object_state_ids) || !personage_object_state_ids.every(id => Types.ObjectId.isValid(id))) {
                return next(ApiError.BadRequest("Invalid ID format(s) in the request."));
            }

            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            const audioFilesRequest: Express.Multer.File[] = request.files as Express.Multer.File[];
            const audioFiles: IAudioFile[] = [];

            for (const audioFileRequest of audioFilesRequest) {
                const {originalname: fileName, path: audioSrc} = audioFileRequest;

                if (!fileName || !audioSrc) {
                    return next(ApiError.BadRequest("File name and audio source are required."));
                }

                audioFiles.push({
                    name: fileName,
                    audioSrc,
                });
            }

            const scenarioData: ITempScenarioCreate = {
                name,
                audioFiles,
                personage_object_state_ids,
                publisher_id,
            };
            const scenarioResponse: IScenarioResponse = await ScenarioService.create(scenarioData);

            if (audioFilesRequest.length > 0) {
                for (const uploadedFile of audioFilesRequest) {
                    const scenarioId = scenarioResponse.id;
                    const newFileName = `${scenarioId}%${uploadedFile.originalname}`;
                    const newPath = path.join("uploads-audio", newFileName);

                    fs.renameSync(uploadedFile.path, newPath);
                }
            }

            response.status(201).json(scenarioResponse);
        } catch (error) {
            next(error);
        }
    }


    async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const scenariosDB: IScenarioDB[] = await ScenarioService.getAll();
            const scenarioAllResponse: IScenarioAllResponse = {
                data: scenariosDB.map((item: IScenarioDB) => ({
                    id: item._id,
                    personage_object_state_ids: item._doc.personage_object_state_ids.map((id: Types.ObjectId) => id),
                    audio_file_ids: item._doc.audio_file_ids.map((id: Types.ObjectId) => id),
                    name: item._doc.name,
                })),
                total: scenariosDB.length
            };

            response.status(200).json(scenarioAllResponse);
        } catch (error) {
            next(error);
        }
    }

    async getById(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            const scenarioResponse: IScenarioResponse = await ScenarioService.getById(id);
            response.status(200).json(scenarioResponse);
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {name, id, personage_object_state_ids, audio_file_ids} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            if (!Array.isArray(personage_object_state_ids) || !personage_object_state_ids.every(id => Types.ObjectId.isValid(id))) {
                return next(ApiError.BadRequest("Invalid ID format(s) in the request."));
            }

            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            const audioFilesRequest: Express.Multer.File[] = request.files as Express.Multer.File[];
            const audioFiles: IAudioFile[] = [];

            if (audioFilesRequest) {
                for (const audioFileRequest of audioFilesRequest) {
                    const {originalname: name, path: audioSrc} = audioFileRequest;

                    if (!name) {
                        return next(ApiError.BadRequest("Name is required."));
                    }

                    if (!audioSrc) {
                        return next(ApiError.BadRequest("Audio src is required."));
                    }

                    audioFiles.push({
                        name,
                        audioSrc
                    });
                }
            }

            const scenario: ITempScenarioUpdate = {
                name, audioFiles, personage_object_state_ids, audio_file_ids
            }

            const scenarioResponse: IScenarioResponse = await ScenarioService.update(id, scenario);

            response.status(200).json(scenarioResponse);
        } catch (error) {
            next(error);
        }
    }

    async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            const message: string = await ScenarioService.delete(id);
            response.status(200).json(message);
        } catch (error) {
            next(error);
        }
    }

    async deleteMany(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {ids} = request.body;
            if (!Array.isArray(ids) || !ids.every(id => Types.ObjectId.isValid(id))) {
                return next(ApiError.BadRequest("Invalid ID format(s) in the request."));
            }

            const idObjects: Types.ObjectId[] = ids.map(id => new Types.ObjectId(id));
            const message: string = await ScenarioService.deleteMany(idObjects);
            response.status(200).json(message);
        } catch (error) {
            next(error);
        }
    }

    async getMediaFileIds(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {RFID} = request.body;
            const audio_file_ids: Types.ObjectId[] = await ScenarioService.getMediaFileIds(RFID);
            response.status(200).json(audio_file_ids);
        } catch (error) {
            next(error);
        }
    }
}

export default new ScenarioController();