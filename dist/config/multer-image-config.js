"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const deleteOldFiles = (directory, fileName, callback) => {
    fs_1.default.readdir(directory, (error, files) => {
        if (error)
            return callback(error);
        const filesToDelete = files.filter((file) => file.startsWith(fileName));
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
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
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
        callback(null, 'uploads-image');
    },
    filename(request, file, callback) {
        const imageId = request.body.id;
        const originalName = file.originalname;
        const newFileName = `${imageId}%${originalName}`;
        deleteOldFiles('uploads-image', originalName, (error) => {
            if (error) {
                console.error(`Error deleting old files: ${error.message}`);
                return callback(null, error.message);
            }
            callback(null, newFileName);
        });
    },
});
const limits = {
    fileSize: 1024 * 1024 * 1024
};
exports.multerUpload = (0, multer_1.default)({ storage, fileFilter, limits }).single('image_file');
