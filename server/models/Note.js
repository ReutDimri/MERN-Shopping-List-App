const mongoose = require('mongoose');

const shoppingItem  = new mongoose.Schema({
  name: {type: String, required: true, trim: true},
  icon: {type: String, default: '🛍️'},
  imageUrl: {type: String, default: ''},
  completed: {type: Boolean, default: false}
});

const shoppingList  = new mongoose.Schema({
  title: {type: String, required: true, trim: true, maxlength: 100},
  items: [shoppingItem],
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  completed: {type: Boolean, default: false}}, 

{timestamps: true}
);

module.exports = mongoose.model('ShoppingList', shoppingList);