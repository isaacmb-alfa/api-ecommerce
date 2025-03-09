import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); 

const dataBaseURI = process.env.DATABASE_URL
    // || 'postgresql://user:password@localhost:5432/database';


const { Pool } = pg;
// export const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'api_ecommerce',
//     password: 'password',
//     port: 5432,
// });

export const pool = new Pool({
    connectionString: dataBaseURI,
    // ssl: true
})