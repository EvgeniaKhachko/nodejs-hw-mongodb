
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function initMongoConnection() {
    // Перевірка на наявність з'єднання через mongoose
    if (mongoose.connection.readyState === 1) {
        console.log("MongoDB is already connected.");
        return;
    }

    try {
      const user = process.env.MONGODB_USER;
      const pwd = process.env.MONGODB_PASSWORD;
      const url = process.env.MONGODB_URL;
      const db = process.env.MONGODB_DB;
      
          const connectURI = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`;
          
          await mongoose.connect( connectURI );
          
        console.log('Mongo connection successfully established!');
      } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
      };
    }
