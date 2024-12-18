import fs from 'fs';
import path from 'path';
import multer from 'multer';

const deleteOldFiles = (directory: string, fileName: string, callback: (error?: NodeJS.ErrnoException) => void) => {
    fs.readdir(directory, (error, files: string[]): void => {
        if (error) return callback(error);

        const filesToDelete: string[] = files.filter((file: string) => file.startsWith(fileName));

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
    const allowedMimeTypes: string[] = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const storage = multer.diskStorage({
    destination(request, file: Express.Multer.File, callback) {
        callback(null, 'uploads-image');
    },
    filename(request, file: Express.Multer.File, callback): void {
        const imageId = request.body.id;
        const originalName: string = file.originalname;
        const newFileName: string = `${imageId}%${originalName}`;

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

export const multerUpload = multer({storage, fileFilter, limits}).single('image_file');
