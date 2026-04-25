import { Router } from 'express';
import * as taskController from './controller.js';
import { assignTaskSchema, updateTaskStatusSchema, taskFiltersSchema } from './schemas.js';
import { validateBody, validateQuery } from '../../middleware/index.js';

const router = Router();

router.post('/assign', validateBody(assignTaskSchema), taskController.assignTask);

router.get('/user', validateQuery(taskFiltersSchema), taskController.getUserTasks);

router.get('/:id', taskController.getTaskById);

router.patch('/:id/status', validateBody(updateTaskStatusSchema), taskController.updateTaskStatus);

export default router;