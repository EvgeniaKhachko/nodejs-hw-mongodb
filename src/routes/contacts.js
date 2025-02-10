
import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody, isValidId } from '../middlewares/validation.js';
import { contactSchema, updateContactSchema } from '../middlewares/validation.js';
import {authenticate} from '../middlewares/authenticate.js'

const router = Router();

router.use('/', authenticate);
router.get('/',authenticate, ctrlWrapper(getContactsController));
router.get('/:contactId', authenticate,isValidId, ctrlWrapper(getContactByIdController));
router.post('/',authenticate, validateBody(contactSchema), ctrlWrapper(createContactController));
router.patch('/:contactId',authenticate, isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactController));
router.delete('/:contactId',authenticate, isValidId, ctrlWrapper(deleteContactController));

export default router;

