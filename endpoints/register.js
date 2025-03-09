import { Router } from 'express';
import { createUser } from '../controllers/user.controllers.js';
import addIdAndTimeStamps from '../middlewares/addIdAndTimeStamps.js';

const router = Router();

/* root: /register */
router.post('/', addIdAndTimeStamps, createUser);

export default router;
