import { Router } from 'express';
import * as verificationController from './controller.js';
import { verificationVoteSchema } from './schemas.js';
import { validateBody } from '../../middleware/index.js';

const router = Router();

router.post('/', validateBody(verificationVoteSchema), verificationController.submitVote);

router.get('/:reportId', verificationController.getReportVerifications);

export default router;