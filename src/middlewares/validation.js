
import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

// Функція для створення middleware валідації body
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

// Middleware для перевірки валідності ObjectId
export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }
  next();
};

// Схема валідації для контактів (створення нового контакту)
export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal").optional(),

});

// Схема валідації для оновлення контакту
export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phoneNumber: Joi.string().min(3).max(20).pattern(/^[\d+()\- ]+$/).message('Phone number must be a valid phone format'),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal").optional(),
}).or("name", "email", "phoneNumber", "isFavourite", "contactType");

// Схема валідації User
export const registerUserValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().required().min(2).max(50).email(),
  password: Joi.string().min(4).required()
});

// Схема валідації login
export const loginUserValidationSchema = Joi.object({
  email: Joi.string().required().min(2).max(50).email(),
  password: Joi.string().min(4).required()
});
