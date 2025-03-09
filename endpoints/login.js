import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateEmail } from '../utils/validations.js';
import { Router } from 'express';
import { secret } from '../config.js';
import { pool } from '../db.js';

const router = Router();

/* root: /login */
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.sendStatus(400);
        return;
    }

    if (!validateEmail(email)) {
        res.status(400).send({ message: 'Invalid email format' });
        return;
    }

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ id: user.id, role: user.role }, secret);
                res.send({
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        gender: user.gender,
                        role: user.role
                    }
                });
            } else {
                res.status(401).send({ message: 'Incorrect password' });
            }
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router;