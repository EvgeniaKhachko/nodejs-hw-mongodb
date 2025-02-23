
import { getContacts, getContactById , createContact, updateContact, deleteContact } from '../services/contacts.js';
import createError from 'http-errors';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { SessionCollection } from "../models/session.js";
import { saveFileToCloudinary} from "../utils/saveFileToCloudinary.js";
import {saveFileToUploadDir} from "../utils/saveFileToUploadDir.js";
import { getEnvVar } from '../utils/getEnvVar.js';

export const getContactsController = async (req, res, next) => {
  try {
    // Обробляємо параметри пагінації
    const { page, perPage } = parsePaginationParams(req.query);
    
    // Обробляємо параметри сортування
    const { sortBy, sortOrder } = parseSortParams(req.query);

    // Перевірка на коректність значень sortBy та sortOrder
    const allowedSortFields = ['name', 'phoneNumber', 'email', 'contactType']; 
    const allowedSortOrders = ['asc', 'desc'];  
   
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = 'name';
    }
    if (!allowedSortOrders.includes(sortOrder)) {
      sortOrder = 'asc';
    }

    const order = sortOrder === 'desc' ? -1 : 1;

    const filter = parseFilterParams(req.query);
    const { sessionId, refreshToken } = req.cookies;
    const currentSession = await SessionCollection.findOne({ _id: sessionId, refreshToken });
    filter.userId = currentSession.userId;
    // Викликаємо функцію для отримання контактів
    const { contacts, totalItems, totalPages } = await getContacts({
      page,
      perPage,
      sortBy,
      sortOrder: order,
      filter,
    });

    // Перевірка на попередню та наступну сторінку
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page: Number(page),
        perPage: Number(perPage),
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      }
    });
  } catch (err) {
    next(err);  // Якщо виникає помилка, передаємо її в middleware
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
   const { sessionId, refreshToken } = req.cookies;
   const currentSession = await SessionCollection.findOne({ _id: sessionId, refreshToken });
   const userId = currentSession.userId;
  const dataToCreateContact = req.body;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }
  dataToCreateContact.userId = userId;
  dataToCreateContact.photo = photoUrl; 
  const newContact = await createContact(dataToCreateContact);
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

    const photo = req.file;
    let photoUrl;

    if (photo) {
      photoUrl = await saveFileToCloudinary(photo);
    }
    const result = await updateContact(contactId, {
      ...req.body,
      photo: photoUrl,
    });
  
    if (!result) {
      throw createError(404, 'Contact not found');
    }
    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result,
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

// import { getContacts, getContactById , createContact, updateContact, deleteContact } from '../services/contacts.js';
// import createError from 'http-errors';

// import { parsePaginationParams } from '../utils/parsePaginationParams.js';
// import { parseSortParams } from '../utils/parseSortParams.js';
// import { parseFilterParams } from '../utils/parseFilterParams.js';
// import Contact from '../models/contact.js';

// export const createContactController = async (req, res, next) => {
//   try {
//     const userId = req.user._id; // Отримуємо ID авторизованого користувача
//     const { name, email, phone } = req.body;

//     if (!name || !email || !phone) {
//       throw createError(400, "All fields (name, email, phone) are required");
//     }

//     const newContact = await Contact.create({ name, email, phone, userId });

//     res.status(201).json({
//       status: 201,
//       message: 'Successfully created a contact!',
//       data: newContact,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// export const getContactsController = async (req, res, next) => {
//   try {
//     const userId = req.user._id; 
//     // Параметри пагінації
//     const { page = 1, perPage = 10 } = parsePaginationParams(req.query);
    
//     // Параметри сортування
//     let { sortBy = 'name', sortOrder = 'asc' } = parseSortParams(req.query);

//     // Перевірка на коректність значень sortBy та sortOrder
//     const allowedSortFields = ['name', 'email', 'phone'];
//     const allowedSortOrders = ['asc', 'desc'];

//     if (!allowedSortFields.includes(sortBy)) sortBy = 'name';
//     if (!allowedSortOrders.includes(sortOrder)) sortOrder = 'asc';

//     const order = sortOrder === 'desc' ? -1 : 1; 
//     const filter = { ...parseFilterParams(req.query), userId };

//     // Отримуємо загальну кількість контактів користувача
//     // const { contacts, totalItems, totalPages } = await getContacts({
//     //   page,
//     //   perPage,
//     //   sortBy,
//     //   sortOrder: order,
//     //   filter,
//     // });
//     const contacts = await Contact.find(filter)
//     .sort({ [sortBy]: order })
//     .skip((page - 1) * perPage)
//     .limit(perPage);

//     res.json({
//       status: 200,
//       message: 'Successfully found contacts!',
//       data: {
//         contacts,
//         page: Number(page),
//         perPage: Number(perPage),
//         totalItems,
//         totalPages,
//         hasPreviousPage: page > 1,
//         hasNextPage: page < totalPages,
//       },
//     });
//   } catch (err) {
//     next(err);  
//   }
// };

// // Контролер для отримання контакту за ID
// export const getContactByIdController = async (req, res, next) => {
//   try {
//     const { contactId } = req.params;
//     const userId = req.user._id;
    
//     const contact = await Contact.findOne({ _id: contactId, userId });
//     // Якщо контакт не знайдений, створюємо помилку 404
//     if (!contact) {
//       throw createError(404, 'Contact not found');
//     }
//     // Якщо контакт знайдений, відправляємо його
//     res.json({
//       status: 200,
//       message: "Successfully found the contact!",
//       data: contact,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const patchContactController = async (req, res, next) => {
//   try {
//     const { contactId } = req.params;
//     const userId = req.user._id;

//     // const updatedContact = await updateContact(contactId, req.body);
//     const updatedContact = await Contact.findOneAndUpdate(
//       { _id: contactId, userId }, // Шукаємо контакт за двома полями
//       req.body,
//       { new: true }
//     );
//     if (!updatedContact || updatedContact.userId.toString() !== userId.toString()) {
//       throw createError(404, 'Contact not found or not authorized');
//     }

//     res.json({
//       status: 200,
//       message: "Successfully updated the contact!",
//       data: updatedContact,
//     });
//   } catch (error) {
//     next(error); 
//   }
// };
// export const deleteContactController = async (req, res, next) => {
//   try {
//     const { contactId } = req.params;
//     const userId = req.user._id;

//     // const deletedContact = await deleteContact(contactId);

//     const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId });

//     // Якщо контакт не знайдено, повертаємо 404
//     if (!deletedContact || deletedContact.userId.toString() !== userId.toString()) {
//       throw createError(404, 'Contact not found');
//     }
//     res.json({
//       status: 200,
//       message: "Successfully deleted the contact!",
//       data: deletedContact,
//     });
//   } catch (error) {
//     next(error); 
//   }
// };