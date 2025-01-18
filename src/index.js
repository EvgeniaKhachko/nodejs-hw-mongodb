import dotenv from 'dotenv';
dotenv.config();

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

(async () => {
    try {
      console.log('Initializing MongoDB connection...');
        // Підключення до MongoDB
        await initMongoConnection();
          
        console.log('Starting server...');
        // Запуск сервера
        setupServer();
    } catch (error) {
        console.error('Error initializing application:', error.message);
        process.exit(1);
    }
})();