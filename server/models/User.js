const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const user = new mongoose.Schema({
  username: {type: String,
    required: true, unique: true, trim: true,
    minlength: 3, maxlength: 20},
  email: { type: String,
    required: true, unique: true,
    trim: true, lowercase: true},
  password: {type: String, required: true, minlength: 6}}, 
  
  {timestamps: true}
);


user.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } 
  catch (error) {next(error);}
});

user.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', user);