const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from cookie
    const token = req.cookies.token;

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if token is expired
        if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ message: 'Token has expired' });
        }

        // Add user to request
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