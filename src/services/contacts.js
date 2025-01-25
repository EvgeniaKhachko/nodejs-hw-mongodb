    
import Contact from '../models/contact.js'; 

export const getContacts = async () => {
  return await Contact.find();
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