import { Router } from 'express';
import { validateToken } from '../middlewares/jwt_validation.js';
import { secret } from '../config.js';
import { pool } from '../db.js';

const router = Router();

router.get('/', validateToken(secret), async (req, res) => {
    const { id } = req.user; // Obtener el ID del usuario desde el token decodificado

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = rows[0];

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const { password, ...userRest } = user; // Remover el campo "password" de la información del usuario
        res.send(userRest); // Enviar todos los atributos del usuario, sin el campo "password"
    } catch (err) {
        console.error('Error al obtener el usuario:', err);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
});

export default router;