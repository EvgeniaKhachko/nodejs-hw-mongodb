import { validateBody,
     registerUserValidationSchema,
      loginUserValidationSchema,
    sendResetEmailValidationSchema,
    resetPasswordValidationSchema
    } from '../middlewares/validation.js';

import { registerUserController,
     loginUserController,
     logoutUserController,
     refreshSessionController,
    sendResetEmailController,
    resetPasswordController
 } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';


const authRouter = Router();

// Реєстрація користувача
authRouter.post('/register',
    validateBody(registerUserValidationSchema),
    ctrlWrapper(registerUserController));

    // Логін користувача
authRouter.post('/login',
    validateBody(loginUserValidationSchema),
    ctrlWrapper(loginUserController));

// Оновлення сесії (додаємо перевірку токену)
authRouter.post('/refresh', 
    authenticate, 
    ctrlWrapper(refreshSessionController));

    // Логаут (додаємо перевірку токену)
authRouter.post('/logout',
    authenticate ,
    ctrlWrapper(logoutUserController));

authRouter.post('/send-reset-email',
    validateBody(sendResetEmailValidationSchema),     
    ctrlWrapper(sendResetEmailController));

authRouter.post('/reset-pwd',
        validateBody(resetPasswordValidationSchema),
        ctrlWrapper(resetPasswordController));
    
export default authRouter;  