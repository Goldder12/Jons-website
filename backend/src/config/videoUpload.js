import fs from 'fs';
import path from 'path';
import multer from 'multer';

const uploadsRoot = path.resolve('uploads');
const videosDirectory = path.join(uploadsRoot, 'videos');

fs.mkdirSync(videosDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, videosDirectory);
    },
    filename(req, file, callback) {
        const safeName = file.originalname.replace(/\s+/g, '-');
        callback(null, `${Date.now()}-${safeName}`);
    },
});

const fileFilter = (req, file, callback) => {
    const isVideo = file.mimetype.startsWith('video/');
    callback(isVideo ? null : new Error('Only video files are allowed for uploads.'), isVideo);
};

const upload = multer({
    storage,
    fileFilter,
});

export const uploadVideoFile = upload.single('videoFile');
