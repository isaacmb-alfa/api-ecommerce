import jwt from 'jsonwebtoken';

export const validateToken = (secret) => {
    return (req, res, next) => {
        const { authorization } = req.headers;
        console.log(authorization);
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(400).send({ message: 'Invalid authorization header' });
        }
        const token = authorization.slice(7);
        try {
            const payload = jwt.verify(token, secret);
            req.user = payload;
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).send({ message: 'Unauthorized' });
        }
    };
};