import fs from 'fs';
import path from 'path';
import multer from 'multer';

const audioDirectory = path.resolve('uploads/audio');
const videoDirectory = path.resolve('uploads/listening-video');
const contentDirectory = path.resolve('uploads/listening-content');

[audioDirectory, videoDirectory, contentDirectory].forEach((directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
});

const allowedAudioTypes = new Set([
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/wave',
    'audio/x-pn-wav',
]);

const storage = multer.diskStorage({
    destination(req, file, callback) {
        if (file.fieldname === 'audio') {
            callback(null, audioDirectory);
            return;
        }

        if (file.fieldname === 'videoFile') {
            callback(null, videoDirectory);
            return;
        }

        if (file.fieldname === 'contentImage') {
            callback(null, contentDirectory);
            return;
        }

        callback(new Error('Unsupported listening task file field.'));
    },
    filename(req, file, callback) {
        const extension = path.extname(file.originalname || '').toLowerCase();
        const safeBaseName = path
            .basename(file.originalname || file.fieldname, extension)
            .replace(/[^a-z0-9]+/gi, '-')
            .replace(/^-+|-+$/g, '')
            .toLowerCase();

        callback(null, `${Date.now()}-${safeBaseName || file.fieldname}${extension}`);
    },
});

const upload = multer({
    storage,
    fileFilter(req, file, callback) {
        if (file.fieldname === 'audio') {
            if (!allowedAudioTypes.has(file.mimetype)) {
                callback(new Error('Only MP3 and WAV audio files are allowed.'));
                return;
            }

            callback(null, true);
            return;
        }

        if (file.fieldname === 'videoFile') {
            if (!file.mimetype.startsWith('video/')) {
                callback(new Error('Only video files are allowed for the optional video.'));
                return;
            }

            callback(null, true);
            return;
        }

        if (file.fieldname === 'contentImage') {
            if (!file.mimetype.startsWith('image/')) {
                callback(
                    new Error('Only image files are allowed for image-based listening sections.')
                );
                return;
            }

            callback(null, true);
            return;
        }

        callback(new Error('Unsupported listening task file field.'));
    },
});

export const uploadListeningTaskFiles = upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'videoFile', maxCount: 1 },
    { name: 'contentImage', maxCount: 1 },
]);
