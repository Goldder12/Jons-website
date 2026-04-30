import express from 'express';
import { parseTest } from '../controllers/parseTestController.js';

const router = express.Router();

router.post('/', parseTest);

export default router;
