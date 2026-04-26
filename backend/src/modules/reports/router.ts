import { Router } from 'express';
import * as reportController from './controller.js';
import { createReportSchema, updateReportSchema, reportFiltersSchema, reportIdSchema } from './schemas.js';
import { authenticate, validateBody, validateQuery } from '../../middleware/index.js';

const router = Router();

router.post('/', authenticate, validateBody(createReportSchema), reportController.createReport);

router.get('/', validateQuery(reportFiltersSchema), reportController.getReports);

router.get('/nearby', reportController.getNearbyReports);

router.get('/:id', reportController.getReportById);

router.put('/:id', authenticate, validateBody(updateReportSchema), reportController.updateReport);

router.delete('/:id', authenticate, reportController.deleteReport);

export default router;
