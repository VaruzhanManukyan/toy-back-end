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
exports.handleFileConversion = exports.multerUpload = exports.multerUploads = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_1 = require("@ffmpeg-installer/ffmpeg");
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.path);
const convertToMp3 = (inputFile, outputFile) => {
    return new Promise((resolve, reject) => {
        console.log(`Converting ${inputFile} to ${outputFile}`);
        (0, fluent_ffmpeg_1.default)(inputFile)
            .audioCodec('libmp3lame') // Ensure MP3 codec is used
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
const deleteOldFiles = (directory, fileName, callback) => {
    fs_1.default.readdir(directory, (error, files) => {
        if (error)
            return callback(error);
        const filesToDelete = files.filter(file => file.startsWith(fileName));
        if (filesToDelete.length === 0) {
            return callback();
        }
        let filesDeleted = 0;
        filesToDelete.forEach((file) => {
            fs_1.default.unlink(path_1.default.join(directory, file), unlinkErr => {
                if (unlinkErr)
                    return callback(unlinkErr);
                filesDeleted++;
                if (filesDeleted === filesToDelete.length) {
                    callback();
                }
            });
        });
    });
};
const fileFilter = (request, file, callback) => {
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
    }
    else {
        callback(null, false);
    }
};
const storage = multer_1.default.diskStorage({
    destination(request, file, callback) {
        callback(null, 'uploads-audio');
    },
    filename(request, file, callback) {
        const scenarioId = request.body.id;
        const originalName = file.originalname;
        const newFileName = `${scenarioId}%${originalName}`;
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
exports.multerUploads = (0, multer_1.default)({ storage, fileFilter, limits }).array('audio_files');
exports.multerUpload = (0, multer_1.default)({ storage, fileFilter, limits }).single('audio_file');
const handleFileConversion = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (Array.isArray(request.files) && request.files.length > 0) {
            const files = request.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const originalFilePath = path_1.default.join('uploads-audio', file.filename);
                if (file.mimetype === 'audio/mpeg') {
                    console.log(`${file.originalname} is already in MP3 format, skipping conversion.`);
                    continue;
                }
                const convertedFilePath = path_1.default.join('uploads-audio', `${file.filename}.mp3`);
                yield convertToMp3(originalFilePath, convertedFilePath);
                file.path = convertedFilePath;
                file.originalname = `${file.originalname}.mp3`;
                fs_1.default.unlink(originalFilePath, (error) => {
                    if (error) {
                        console.error('Error deleting original file:', error);
                    }
                });
            }
            request.files = files;
        }
        else if (request.file) {
            const file = request.file;
            const originalFilePath = path_1.default.join('uploads-audio', file.filename);
            if (file.mimetype !== 'audio/mpeg') {
                const convertedFilePath = path_1.default.join('uploads-audio', `${file.filename}-${Date.now()}.mp3`);
                yield convertToMp3(originalFilePath, convertedFilePath);
                request.file.path = convertedFilePath;
                request.file.originalname = `${file.originalname}.mp3`;
                fs_1.default.unlink(originalFilePath, (error) => {
                    if (error) {
                        console.error('Error deleting original file:', error);
                    }
                });
            }
        }
        else {
            response.status(400).json({ message: 'No file uploaded' });
        }
        next();
    }
    catch (error) {
        console.error('Error during file conversion:', error);
        response.status(500).json({ message: 'Error during file conversion' });
    }
});
exports.handleFileConversion = handleFileConversion;
