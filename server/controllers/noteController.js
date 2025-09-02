const Note = require('../models/Note');
const mongoose = require('mongoose');

const findUserNote = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    throw new Error('Shopping list not found');
  }
  return note;
};


const noteCreation = async (req, res) => {
  try {
    const { title, items } = req.body;

    const note = new Note({
      title, 
      items: items || [], 
      userId: req.loggedUser._id});
    await note.save();

    res.status(201).json({message: 'Shopping list created successfully', note});
  } 
  catch (error) {res.status(500).json({ error: error.message });}
};


const getUserNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.loggedUser._id })
      .sort({ createdAt: -1 });

    res.json({ notes });
  } 
  catch (error) {res.status(500).json({ error: error.message });}
};


const getNote = async (req, res) => {
  try {
    const note = await findUserNote(req.params.id, req.loggedUser._id);
    res.json({ note });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, items } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.loggedUser._id },
      { title, items },
      { new: true, runValidators: true });

    if (!note) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }

    res.json({message: 'Shopping list updated successfully', note});
  } 
  catch (error) {res.status(500).json({ error: error.message });}
};

 
const noteComplete = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.loggedUser._id },
      { completed: true },
      { new: true });

    if (!note) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }

    res.json({message: 'Shopping list marked as complete', note});
  } 
  catch (error) {res.status(500).json({ error: error.message });}
};


const addItem = async (req, res) => {
  try {
    const { name, icon, imageUrl } = req.body;
    const note = await findUserNote(req.params.id, req.loggedUser._id);
    
    note.items.push({name, 
      icon: icon || '🛍️',
      imageUrl: imageUrl || '',
      completed: false});
    await note.save();
    res.json({message: 'Item added successfully', note});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const toggleItemComplete = async (req, res) => {
  try {
    const { noteId, itemId } = req.params;
    const note = await findUserNote(noteId, req.loggedUser._id);
    
    const item = note.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    item.completed = !item.completed;
    await note.save();
    res.json({message: 'Item status updated', note});
  } 
  catch (error) {res.status(500).json({ error: error.message });}
};


const deleteItem = async (req, res) => {
  try {
    const { noteId, itemId } = req.params;
    const note = await findUserNote(noteId, req.loggedUser._id);
    
    note.items.pull(itemId);
    await note.save();
    res.json({message: 'Item deleted successfully', note});
  } 
  catch (error) {res.status(500).json({ error: error.message });}
};


const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.loggedUser._id});

    if (!note) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }

    res.json({ message: 'Shopping list delete successfully' });
  } 
  catch (error) {res.status(500).json({ error: error.message });}
};

module.exports = {
  noteCreation,
  getUserNotes,
  getNote,
  updateNote,
  noteComplete,
  addItem,
  toggleItemComplete,
  deleteItem,
  deleteNote
};