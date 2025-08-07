const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // FIXED HERE 👇
      req.user = await User.findById(decoded.user).select('-password');

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please log in again.' });
      }
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
  }
};

const clientOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in first.'
    });
  }

  if (req.user.role !== 'Client') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This action is only available to clients.'
    });
  }

  next();
};

const providerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in first.'
    });
  }

  if (req.user.role !== 'Provider') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This action is only available to providers.'
    });
  }

  next();
};

module.exports = {protect, clientOnly, providerOnly};


