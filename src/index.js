import dotenv from 'dotenv';
dotenv.config();

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR} from './constants/path.js';


(async () => {
    try {
   
      console.log('Initializing MongoDB connection...');
        // Підключення до MongoDB
        await initMongoConnection();
          
    await createDirIfNotExists(TEMP_UPLOAD_DIR);


        console.log('Starting server...');
        // Запуск сервера
        setupServer();
    } catch (error) {
        console.error('Error initializing application:', error.message);
        process.exit(1);
    }
})();