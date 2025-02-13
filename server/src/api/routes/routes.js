import express from 'express';
import { getTasksController, deleteTaskController, createTaskController, updateTaskStatusController } from '../../controller/controller.js';

const router = express.Router();

router.get('/', getTasksController);
router.delete('/:id', deleteTaskController);
router.post('/', createTaskController);
router.patch('/:id', updateTaskStatusController); 

export default router;
