      
import Contact from '../models/contact.js'; 

export const getContacts = async ({ page, perPage, sortBy, sortOrder, filter }) => {
  try {
    console.log("Filter:", filter); // Логування фільтру

    const contacts = await Contact.find(filter)  // Запит до бази даних
      .skip((page - 1) * perPage)  // Пагінація
      .limit(perPage)  
      .sort({ [sortBy]: sortOrder });  

    const totalItems = await Contact.countDocuments(filter);  // Підрахунок кількості контактів
    const totalPages = Math.ceil(totalItems / perPage);  // Обчислення кількості сторінок

    return { contacts, totalItems, totalPages };
  } catch (err) {
    console.error("Error in getContacts service:", err);
    throw err;  // Кидаємо помилку далі
  }
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (payload) => {  
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContact = async (id, updateData) => {
  const updatedContact = await Contact.findByIdAndUpdate
  (id, updateData, { new: true, runValidators: true });
  return updatedContact;
};
export const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};

// import Contact from '../models/contact.js'; 

// export const getContacts = async ({ page, perPage, sortBy, sortOrder, filter }) => {
//   try {
//     console.log("Filter:", filter); 
//     if (typeof filter !== 'object') {
//       throw createHttpError(400, 'Invalid filter format');
//     }
//     const contacts = await Contact.find(filter)  // Запит до бази даних
//       .skip((page - 1) * perPage)  // Пагінація
//       .limit(perPage)  
//       .sort({ [sortBy]: sortOrder });  

//     const totalItems = await Contact.countDocuments(filter);  // Підрахунок кількості контактів
//     const totalPages = Math.ceil(totalItems / perPage);  // Обчислення кількості сторінок

//     return { contacts, totalItems, totalPages };
//   } catch (err) {
//     console.error("Error in getContacts service:", err);
//     throw err;  
//   }
// };

// export const getContactById = async (id) => {
//   return await Contact.findById(id);
// };
// // export const getContactById = async (id, userId) => {
// //   return await Contact.findOne({ _id: id, userId });
// // };

// export const createContact = async (payload) => {  
//   return await Contact.create(payload);
// };

// export const updateContact = async (id, updateData) => {
//   const updatedContact = await Contact.findByIdAndUpdate
//   (id, updateData, { new: true, runValidators: true });
//   return updatedContact;
// };

// // export const updateContact = async (id, updateData, userId) => {
// //   return await Contact.findOneAndUpdate(
// //     { _id: id, userId },
// //     updateData,
// //     { new: true, runValidators: true }
// //   );
// // };

// export const deleteContact = async (id, userId) => {
//   return await Contact.findOneAndDelete({ _id: id, userId });
// };