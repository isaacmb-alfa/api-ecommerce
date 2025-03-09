import pg from 'pg';


const { Pool } = pg;
export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'api_ecommerce',
    password: 'password',
    port: 5432,
});

