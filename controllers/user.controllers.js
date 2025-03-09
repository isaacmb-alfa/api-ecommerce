import bcrypt from 'bcrypt';
import { pool } from '../db.js';
import { validateEmail } from '../utils/validations.js';

export const createUser = async (req, res) => {
    const {
        first_name,
        last_name,
        gender,
        email,
        password,
        role
    } = req.body;

    if (!email || !password || (gender !== 'M' && gender !== 'F' && gender !== 'o')) {
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

        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                first_name,
                last_name,
                gender,
                email,
                password: hashedPassword,
                role: role || 'CUSTOMER'
            };

            const result = await pool.query(
                'INSERT INTO users (first_name, last_name, gender, email, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [newUser.first_name, newUser.last_name, newUser.gender, newUser.email, newUser.password, newUser.role]
            );

            res.status(201).send({ message: 'User created successfully', user: result.rows[0] });
        } else {
            res.status(403).send({ message: 'Duplicated email' });
        }
    } catch (err) {
        res.status(500).send(err);
    }
};