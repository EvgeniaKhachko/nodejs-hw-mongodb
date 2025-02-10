import { validateBody, registerUserValidationSchema, loginUserValidationSchema } from '../middlewares/validation.js';

import { registerUserController,
     loginUserController,
     logoutUserController,
     refreshSessionController } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/register',
    validateBody(registerUserValidationSchema),
    ctrlWrapper(registerUserController));
authRouter.post('/login',validateBody(loginUserValidationSchema),
    ctrlWrapper(loginUserController));
authRouter.post('/refresh-session', ctrlWrapper(refreshSessionController));
authRouter.post('/logout',ctrlWrapper(logoutUserController));

export default authRouter;  