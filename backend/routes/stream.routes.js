import express from 'express';
import { streamVideo } from '../controllers/stream.controller.js';

const router = express.Router();

router.get('/:id', streamVideo);

export default router;
