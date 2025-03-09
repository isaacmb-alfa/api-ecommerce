import { pool } from '../db.js';

// Función para crear un producto
export const createProduct = async (req, res) => {
    const {
        is_active,
        product_name,
        description,
        price,
        category,
        brand,
        image
    } = req.body;

    // Validar los datos de entrada
    if (!product_name || !description || !price || !category || !brand || !image) {
        res.status(400).send({ message: 'Todos los campos son obligatorios' });
        return;
    }

    try {
        const result = await pool.query(
            'INSERT INTO products (is_active, product_name, description, price, category, brand, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [is_active, product_name, description, price, category, brand, image]
        );

        res.status(201).send({ message: 'Producto creado exitosamente', product: result.rows[0] });
    } catch (err) {
        console.error('Error al crear el producto:', err);
        res.status(500).send({ message: 'Error interno del servidor', error: err });
    }
};