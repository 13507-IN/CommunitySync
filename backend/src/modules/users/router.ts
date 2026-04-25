import { Router } from 'express';
import * as userController from './controller.js';
import { updateProfileSchema } from './schemas.js';
import { validateBody, authenticate } from '../../middleware/index.js';

const router = Router();

router.get('/profile', authenticate, userController.getProfile);

router.put('/profile', authenticate, validateBody(updateProfileSchema), userController.updateProfile);

export default router;