const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; 
    const secret = process.env.JWT_SECRET;
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token:', token, secret });
    }
};

module.exports = authMiddleware;
