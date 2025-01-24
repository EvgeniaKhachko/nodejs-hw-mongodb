

import createError from 'http-errors';

export const notFoundHandler = (req, res, next) => {
  // Створюємо помилку 404 і передаємо її далі
  const error = createError(404, 'Route not found: ${req.originalUrl}');
  next(error);
};
