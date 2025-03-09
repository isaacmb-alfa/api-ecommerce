import { Router } from 'express';
import { pool } from '../db.js';
import { createUser } from '../controllers/user.controllers.js';
import addIdAndTimeStamps from '../middlewares/addIdAndTimeStamps.js';

const router = Router();

router.get('/', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM users');
    res.send(rows);
});
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (rows.length === 0) {
        return res.status(404).send('El usuario con el id ' + id + ' no existe');
    }
    res.send(rows);
});
router.post('/', addIdAndTimeStamps, createUser);

router.delete('/:id',async (req, res) => {
    const { id } = req.params;
    const { rows, rowCount } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (rowCount=== 0) {
        return res.status(404).send('El usuario con el id ' + id + ' no existe');
    }
    res.send(rows);
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, role } = req.body;

    // Validar los datos de entrada
    if (!first_name || !last_name || !email || !role) {
        return res.status(400).send({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const { rowCount } = await pool.query(
            'UPDATE users SET first_name = $1, last_name = $2, email = $3, role = $4, updated_at = NOW() WHERE id = $5',
            [first_name, last_name, email, role, id]
        );

        if (rowCount === 0) {
            return res.status(404).send({ message: 'El usuario con el id ' + id + ' no existe' });
        }

        res.send('User updated successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


export default router;