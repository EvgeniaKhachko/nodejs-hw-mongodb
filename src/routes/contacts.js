
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

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post('/', validateBody(contactSchema), ctrlWrapper(createContactController));
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactController));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;

