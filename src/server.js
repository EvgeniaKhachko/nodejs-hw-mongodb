import express, { application, json } from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import contactsRouter from './routes/contacts.js'; // Імпортуємо роутер
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/path.js';
import { upload } from './middlewares/multer.js';
import path from 'path';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import YAML from 'yamljs';



const swaggerDocument = YAML.load(path.join('docs', 'openapi.yaml'));

const PORT = Number(process.env.PORT) || 3000;  

export function setupServer() {
  const app = express();// Ініціалізуємо додаток Express

 // Додаємо middleware для обробки JSON
  app.use(json({
    type:['application/json', 'application/vnd.api+json']
  })); 


  app.use(cors());

  app.use(cookieParser());

  app.use(
    pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.originalUrl}`); // Логуємо шлях та метод запиту
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.use('/auth', authRouter);

app.get('/reset-password', (req, res) => {
  res.json({ message: 'Token is valid' });
});

// Роут для /contacts
  app.use('/contacts', contactsRouter);
 
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
 
  // Middleware для обробки 404
  app.use(notFoundHandler);

// Middleware для обробки помилок
app.use(errorHandler);

 app.listen(PORT, () => {
   console.log(`Server is running on ${PORT}`);
 });

};


