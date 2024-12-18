import path from "path";
import {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IAudioFile, IAudioFileAllResponse, IAudioFileDB, IAudioFileResponse} from "../shared/interfaces/audio-file-interfaces";
import AudioFileService from "../services/audio-file-service";

class AudioFileController {
    async create(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const audioFileRequest: Express.Multer.File = request.file as Express.Multer.File;
            const {originalname: name, path: audioSrc} = audioFileRequest;
            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            if (!audioSrc) {
                return next(ApiError.BadRequest("Audio src is required."));
            }

            const audioFile: IAudioFile = {
                name,
                audioSrc: audioSrc.split("\\")[1]
            }

            const audioFileDB: IAudioFileDB = await AudioFileService.create(audioFile);
            const audioFileResponse: IAudioFileResponse = {
                id: audioFileDB._id,
                ...audioFileDB._doc
            }

            response.status(201).json(audioFileResponse);
        } catch (error) {
            next(error);
        }
    }

    async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const audioFilesDB: IAudioFileDB[] = await AudioFileService.getAll();
            const audioFilesResponse: IAudioFileAllResponse = {
                data: audioFilesDB.map((item: IAudioFileDB) => ({
                    id: item._id,
                    ...item._doc
                })),
                total: audioFilesDB.length
            }

            response.status(200).json(audioFilesResponse);
        } catch (error) {
            next(error);
        }
    }

    async getFilteredAudioFiles(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {ids} = request.body;
            if (!Array.isArray(ids) || !ids.every(id => Types.ObjectId.isValid(id))) {
                return next(ApiError.BadRequest("Invalid ID format(s) in the request."));
            }

            const audioFilesDB: IAudioFileDB[] = await AudioFileService.getFilteredAudioFiles(ids);
            const audioFilesResponse: IAudioFileAllResponse = {
                data: audioFilesDB.map((item: IAudioFileDB) => ({
                    id: item._id,
                    ...item._doc
                })),
                total: audioFilesDB.length
            }

            response.status(200).json(audioFilesResponse);
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

            const audioFileDB: IAudioFileDB = await AudioFileService.getById(id);
            const audioFileResponse: IAudioFileResponse = {
                id: audioFileDB._id,
                scenario_id: audioFileDB.scenario_id,
                ...audioFileDB._doc
            }

            response.status(200).json(audioFileResponse);
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            const audioFileRequest: Express.Multer.File = request.file as Express.Multer.File;
            const {originalname: name, path: audioSrc} = audioFileRequest;

            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            if (!audioSrc) {
                return next(ApiError.BadRequest("Audio src is required."));
            }

            const audioFile: IAudioFile = {
                name: audioFileRequest.originalname,
                audioSrc: audioFileRequest.path.split("\\")[1]
            }
            const audioFileDBUpdate: IAudioFileDB = await AudioFileService.update(id, audioFile);
            const audioFileResponse: IAudioFileResponse = {
                id: audioFileDBUpdate._id,
                ...audioFileDBUpdate._doc
            }

            response.status(200).json(audioFileResponse);
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

            const message: string = await AudioFileService.delete(id);
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

            const message: string = await AudioFileService.deleteMany(ids);
            response.status(200).json(message);
        } catch (error) {
            next(error);
        }
    }

    async getToyMedia(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {audio_file_id} = request.body;
            if (!Types.ObjectId.isValid(audio_file_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${audio_file_id}`));
            }

            const audioFile: IAudioFileDB = await AudioFileService.getById(audio_file_id);
            const filePath: string = path.resolve(`uploads-audio\\${audioFile._doc.audioSrc}`);
            response.download(filePath, audioFile._doc.name, (error) => {
                if (error) {
                    next(error);
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AudioFileController();