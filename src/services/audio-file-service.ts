import fs from "fs";
import path from "path";
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IAudioFile, IAudioFileDB} from "../shared/interfaces/audio-file-interfaces";
import {IScenarioDB} from "../shared/interfaces/scenario-interfaces";
import AudioFileModel from "../models/audio-file-model";
import ScenarioModel from "../models/scenario-model";

class AudioFileService {
    async create(audioFile: IAudioFile): Promise<IAudioFileDB> {
        try {
            const audioFileDB = new AudioFileModel(audioFile);
            await audioFileDB.save();

            const newPath = `${audioFileDB._id}%${audioFileDB._doc.audioSrc.split("%")[1]}`;
            fs.renameSync(`uploads-audio\\${audioFileDB._doc.audioSrc}`, `uploads-audio\\${newPath}`);

            const audioFileDBUpdated: IAudioFileDB | null = await AudioFileModel.findOneAndUpdate(
                {_id: audioFileDB._id},
                {$set: {audioSrc: newPath}},
                {new: true}
            );
            if (!audioFileDBUpdated) {
                throw ApiError.BadRequest(`Audio file with id ${audioFileDB._id} not found.`);
            }

            return audioFileDB;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<IAudioFileDB[]> {
        try {
            const audioFilesDB: IAudioFileDB[] = await AudioFileModel.find();
            return audioFilesDB;
        } catch (error) {
            throw error;
        }
    }

    async getFilteredAudioFiles(ids: Types.ObjectId[]): Promise<IAudioFileDB[]> {
        try {
            if (!Array.isArray(ids) || !ids.every(id => Types.ObjectId.isValid(id))) {
                throw ApiError.BadRequest("Invalid ID format(s) in the request.");
            }

            const audioFilesDB: IAudioFileDB[] = [];
            for (const id of ids) {
                const audioFileDB: IAudioFileDB | null = await AudioFileModel.findById(id);
                if (!audioFileDB) {
                    throw ApiError.BadRequest(`Audio file with id ${id} not found.`);
                }
                audioFilesDB.push(audioFileDB);
            }

            return audioFilesDB;
        } catch (error) {
            throw error;
        }
    }

    async getById(id: Types.ObjectId): Promise<IAudioFileDB> {
        try {
            const audioFileDB: IAudioFileDB | null = await AudioFileModel.findById(id);
            if (!audioFileDB) {
                throw ApiError.BadRequest(`Audio file with id ${id} not found.`);
            }

            const scenarioDB: IScenarioDB | null = await ScenarioModel.findOne({audio_file_ids: {$in: [id]}});
            audioFileDB.scenario_id = scenarioDB ? scenarioDB._id : undefined;

            return audioFileDB;
        } catch (error) {
            throw error;
        }
    }

    async update(id: Types.ObjectId, audioFile: IAudioFile): Promise<IAudioFileDB> {
        try {
            const audioFileDB: IAudioFileDB | null = await AudioFileModel.findById(id);
            if (!audioFileDB) {
                throw ApiError.BadRequest(`Audio file with id ${id} not found.`);
            }

            if (audioFileDB._doc.audioSrc !== audioFile.audioSrc) {
                const filePath: string = path.resolve(`uploads-audio\\${audioFileDB._doc.audioSrc}`);
                fs.unlink(filePath, (error) => {
                    if (error) {
                        console.error(`Failed to delete file ${filePath}: ${error.message}`);
                    }
                });
                const audioFileDBUpdated: IAudioFileDB | null = await AudioFileModel.findOneAndUpdate(
                    {_id: id},
                    {$set: audioFile},
                    {new: true}
                );
                if (!audioFileDBUpdated) {
                    throw ApiError.BadRequest(`Audio file with id ${id} not found.`);
                }
                return audioFileDBUpdated;

            } else {
                return audioFileDB;
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(id: Types.ObjectId): Promise<string> {
        try {
            const audioFileDB: IAudioFileDB | null = await AudioFileModel.findById(id);
            if (!audioFileDB) {
                throw ApiError.BadRequest(`Audio file with id ${id} not found.`);
            }

            await ScenarioModel.updateMany(
                {audio_file_ids: id},
                {$pull: {audio_file_ids: id}}
            );

            const filePath: string = path.resolve(`uploads-audio\\${audioFileDB._doc.audioSrc}`);
            fs.unlink(filePath, (error) => {
                if (error) {
                    console.error(`Failed to delete file ${filePath}: ${error.message}`);
                }
            });

            const result = await AudioFileModel.deleteOne({_id: id});
            if (result.deletedCount === 0) {
                throw ApiError.BadRequest(`Audio file with id ${id} not found.`);
            }

            return "Audio file is deleted";

        } catch (error) {
            throw error;
        }
    }

    async deleteMany(ids: Types.ObjectId[]): Promise<string> {
        try {
            let deletedCount: number = 0;

            for (const id of ids) {
                const audioFileDB: IAudioFileDB | null = await AudioFileModel.findById(id);
                if (!audioFileDB) {
                    throw ApiError.BadRequest(`Audio file with id ${id} not found.`);
                }

                await ScenarioModel.updateMany(
                    {audio_file_ids: id},
                    {$pull: {audio_file_ids: id}}
                );

                const filePath: string = path.resolve(`uploads-audio\\${audioFileDB._doc.audioSrc}`);
                fs.unlink(filePath, (error) => {
                    if (error) {
                        console.error(`Failed to delete file ${filePath}: ${error.message}`);
                    }
                });

                const result = await AudioFileModel.deleteOne({_id: id});
                if (result.deletedCount === 0) {
                    throw ApiError.BadRequest(`Failed to delete audio file with id ${id}.`);
                }

                deletedCount += result.deletedCount;
            }

            return `${deletedCount} audio file(s) deleted successfully.`;
        } catch (error) {
            throw error;
        }
    }
}

export default new AudioFileService();
