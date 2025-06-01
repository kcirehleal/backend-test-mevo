import { DataSource } from 'typeorm';
import { Transaction } from '../models/Transaction';
import { ProcessedFile } from '../models/ProcessedFile';
import { InvalidTransaction } from '../models/InvalidTransaction';
import 'dotenv/config';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    entities: [Transaction, ProcessedFile, InvalidTransaction],
});

export const initializeDatabase = async (): Promise<boolean> => {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');
        return true;
    } catch (error) {
        console.error('Error during Data Source initialization:', error);
        return false;
    }
};
