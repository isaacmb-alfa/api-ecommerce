import { Router } from 'express';
import { pool } from '../db.js';
import { createProduct } from '../controllers/items.controllers.js';

const router = Router();


// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM products');
        res.status(200).send(rows);
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
});

// Crear un producto
router.post('/', createProduct);

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).send({ message: 'Producto no encontrado' });
        }
        res.status(200).send(rows[0]);
    } catch (err) {
        console.error('Error al obtener el producto:', err);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
});

// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
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
    if (!product_name || !description || !price || !category || !brand || !image || !id ) {
        res.status(400).send({ message: 'Todos los campos son obligatorios' });
        return;
    }

    try {
        const { rowCount } = await pool.query(
            'UPDATE products SET is_active = $1, product_name = $2, description = $3, price = $4, category = $5, brand = $6, image = $7, updated_at = NOW() WHERE id = $8',
            [is_active, product_name, description, price, category, brand, image, id]
        );

        if (rowCount === 0) {
            return res.status(404).send({ message: 'Producto no encontrado' });
        }

        res.status(200).send({ message: 'Producto actualizado exitosamente' });
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
});

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
        if (rowCount === 0) {
            return res.status(404).send({ message: 'Producto no encontrado' });
        }
        res.status(200).send({ message: 'Producto eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
});


export default router;