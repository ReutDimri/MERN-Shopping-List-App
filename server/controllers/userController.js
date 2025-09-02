const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

const userCreation = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists'});
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {id: user._id, username: user.username, email: user.email}
    });
  } 
  catch (error) {res.status(500).json({ error: error.message });}
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'invalid credentials. please try again' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials. please try again' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {id: user._id, username: user.username, email: user.email}
    });
  } 
  catch (error) {res.status(500).json({ error: error.message });}
};


const getUserProfile = async (req, res) => {
  try {
    res.json({
      user: {id: req.loggedUser._id, username: req.loggedUser.username, email: req.loggedUser.email}});
  } 
  catch (error) {res.status(500).json({ error: error.message });}
};

 
const userUpdate = async (req, res) => {
  try {
    const { username, email } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.loggedUser._id, updates,
      { new: true, runValidators: true }).select('-password');

    res.json({message: 'User updated successfully', user});
  } 
  catch (error) {res.status(500).json({ error: error.message });}
};


const userDelete = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.loggedUser._id);
    res.json({ message: 'User delete successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  userCreation,
  loginUser,
  getUserProfile,
  userUpdate,
  userDelete
};