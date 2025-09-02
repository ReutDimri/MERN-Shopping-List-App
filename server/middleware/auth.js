const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {return res.status(401).json({ error: 'No token provided' });}

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const loggedUser = await User.findById(decoded.userId).select('-password');
    
    if (!loggedUser) {return res.status(401).json({ error: 'User not found' });}
    req.loggedUser = loggedUser;

    next();
  } 
  catch (error) {res.status(401).json({ error: 'Invalid token' })}
};

module.exports = auth;