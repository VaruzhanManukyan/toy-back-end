import fs from 'fs';
import path from 'path';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import {path as ffmpegPath} from '@ffmpeg-installer/ffmpeg';
import express from "express";

ffmpeg.setFfmpegPath(ffmpegPath);

const convertToMp3 = (inputFile: string, outputFile: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        console.log(`Converting ${inputFile} to ${outputFile}`);

        ffmpeg(inputFile)
            .audioCodec('libmp3lame')
            .toFormat('mp3')
            .on('end', () => {
                console.log(`Conversion completed: ${outputFile}`);
                resolve();
            })
            .on('error', (error) => {
                console.error('Error during conversion:', error);
                reject(error);
            })
            .save(outputFile);
    });
};

const deleteOldFiles = (directory: string, fileName: string, callback: (error?: NodeJS.ErrnoException) => void): void => {
    fs.readdir(directory, (error, files: string[]): void => {
        if (error) return callback(error);

        const filesToDelete: string[] = files.filter(file => file.startsWith(fileName));

        if (filesToDelete.length === 0) {
            return callback();
        }

        let filesDeleted: number = 0;
        filesToDelete.forEach((file: string): void => {
            fs.unlink(path.join(directory, file), unlinkErr => {
                if (unlinkErr) return callback(unlinkErr);
                filesDeleted++;
                if (filesDeleted === filesToDelete.length) {
                    callback();
                }
            });
        });
    });
};

const fileFilter = (request: Express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback): void => {
    const allowedMimeTypes = [
        'audio/mpeg',
        'audio/wav',
        'audio/flac',
        'audio/aac',
        'audio/aiff',
        'audio/x-aiff',
        'audio/x-m4a',
        'audio/mp4',
        'audio/x-ms-wma',
        'audio/ogg',
        'audio/opus',
        'audio/vnd.dlna.adts',
        'audio/x-wav',
        'audio/x-flac',
        'audio/dsd',
        'audio/x-dsd',
        'application/octet-stream'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const storage = multer.diskStorage({
    destination(request, file, callback): void {
        callback(null, 'uploads-audio');
    },
    filename(request, file, callback): void {
        const scenarioId = request.body.id;
        const originalName: string = file.originalname;
        const newFileName: string = `${scenarioId}%${originalName}`;

        deleteOldFiles('uploads-audio', originalName, (error) => {
            if (error) {
                console.error(`Error deleting old files: ${error.message}`);
                return callback(null, error.message);
            }
            callback(null, newFileName);
        });
    },
});

const limits = {
    fileSize: 1024 * 1024 * 1024 * 10,
};

export const multerUploads = multer({storage, fileFilter, limits}).array('audio_files');
export const multerUpload = multer({storage, fileFilter, limits}).single('audio_file');

export const handleFileConversion = async (request: Express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        if (Array.isArray(request.files) && request.files.length > 0) {
            const files: Express.Multer.File[] = request.files as Express.Multer.File[];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const originalFilePath: string = path.join('uploads-audio', file.filename);


                if (file.mimetype === 'audio/mpeg') {
                    console.log(`${file.originalname} is already in MP3 format, skipping conversion.`);
                    continue;
                }

                const convertedFilePath: string = path.join('uploads-audio', `${file.filename}.mp3`);
                await convertToMp3(originalFilePath, convertedFilePath);

                file.path = convertedFilePath;
                file.originalname = `${file.originalname}.mp3`;

                fs.unlink(originalFilePath, (error): void => {
                    if (error) {
                        console.error('Error deleting original file:', error);
                    }
                });
            }

            request.files = files;
        } else if (request.file) {
            const file: Express.Multer.File = request.file as Express.Multer.File;
            const originalFilePath: string = path.join('uploads-audio', file.filename);


            if (file.mimetype !== 'audio/mpeg') {
                const convertedFilePath: string = path.join('uploads-audio', `${file.filename}-${Date.now()}.mp3`);

                await convertToMp3(originalFilePath, convertedFilePath);

                request.file.path = convertedFilePath;
                request.file.originalname = `${file.originalname}.mp3`;

                fs.unlink(originalFilePath, (error): void => {
                    if (error) {
                        console.error('Error deleting original file:', error);
                    }
                });
            }
        } else {
            response.status(400).json({message: 'No file uploaded'});
        }
        next();
    } catch (error) {
        console.error('Error during file conversion:', error);
        response.status(500).json({message: 'Error during file conversion'});
    }
};
