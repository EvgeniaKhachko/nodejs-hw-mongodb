import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import contactsRouter from './routes/contacts.js';

export function setupServer() {
 const app = express();
  app.use(pino());
  app.use(cors());
  app.use('/contacts', contactsRouter);

 app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
});

const PORT = Number(process.env.PORT) || 3000;
 app.listen(PORT, () => {
   console.log(`Server is running on ${PORT}`);
 });
 
};

