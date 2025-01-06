import express from 'express';
import { getTasks } from '../../controller/controller.js';

const router = express.Router();

router.get('/', getTasks);

export default router;
