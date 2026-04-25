import { Router } from 'express';
import * as governmentController from './controller.js';
import { governmentActionSchema, updateReportStatusSchema } from './schemas.js';
import { validateBody } from '../../middleware/index.js';

const router = Router();

router.post('/action', validateBody(governmentActionSchema), governmentController.createAction);

router.get('/report/:reportId', governmentController.getReportActions);

router.patch('/report/:reportId/status', validateBody(updateReportStatusSchema), governmentController.updateReportStatus);

export default router;