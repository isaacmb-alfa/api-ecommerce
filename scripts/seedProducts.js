import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../db.js';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo db.json
const filePath = path.join(__dirname, '../db.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Extraer los productos del archivo
const products = data.items;

// Función para insertar productos en la base de datos
const insertProducts = async () => {
    try {
        for (const product of products) {
            const {
                isActive,
                id,
                product_name,
                description,
                price,
                category,
                brand,
                sku,
                createdAt,
                updatedAt,
                image
            } = product;

            await pool.query(
                'INSERT INTO products (is_active, product_name, description, price, category, brand, sku, created_at, updated_at, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                [isActive, product_name, description, price, category, brand, sku, createdAt, updatedAt, image]
            );
        }
        console.log('Productos insertados exitosamente');
    } catch (err) {
        console.error('Error al insertar productos:', err);
    } finally {
        pool.end();
    }
};

// Ejecutar la función para insertar productos
insertProducts();