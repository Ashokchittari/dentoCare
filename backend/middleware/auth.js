const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    
    const token = req.cookies.token;

    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        
        if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ message: 'Token has expired' });
        }

        
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Server error' });
    }
}; 