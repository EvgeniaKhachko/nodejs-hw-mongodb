

import { getContacts, getContactById , createContact, updateContact, deleteContact } from '../services/contacts.js';
import createError from 'http-errors';

// Контролер для отримання всіх контактів
export const getContactsController = async (req, res, next) => {
  try {
    const contacts = await getContacts(); // Отримуємо контакти
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts, 
    });
  } catch (err) {
    next(err); // Передаємо помилку далі в middleware
  }
};

// Контролер для отримання контакту за ID
export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params; 
    const contact = await getContactById(contactId); 
    // Якщо контакт не знайдений, створюємо помилку 404
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    // Якщо контакт знайдений, відправляємо його
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
// Контролер для створення нового контакту
export const createContactController = async (req, res, next) => {
  console.log(req.body)
try {
  const newContact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
} catch (err) {
  next(err); 
}
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params; // ID контакту з параметрів маршруту
    const updateData = req.body; // Дані для оновлення  запиту

    const updatedContact = await updateContact(contactId, updateData);

    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error); 
  }
};
export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await deleteContact(contactId);

    // Якщо контакт не знайдено, повертаємо 404
    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }
    // Успішне видалення
    res.status(204).send(); 
  } catch (error) {
    next(error); 
  }
};