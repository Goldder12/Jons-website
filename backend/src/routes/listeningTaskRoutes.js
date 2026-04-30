import express from 'express';
import {
    createListeningTask,
    deleteListeningTask,
    getListeningTasks,
} from '../controllers/listeningTaskController.js';
import { uploadListeningTaskFiles } from '../config/listeningTaskUpload.js';

const router = express.Router();

router.get('/', getListeningTasks);
router.post('/', uploadListeningTaskFiles, createListeningTask);
router.delete('/:id', deleteListeningTask);

export default router;
