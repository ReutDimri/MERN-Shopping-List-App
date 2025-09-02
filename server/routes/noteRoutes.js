const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {noteCreation, getUserNotes, getNote, updateNote, noteComplete,
  addItem, toggleItemComplete, deleteItem, deleteNote} = require('../controllers/noteController');

router.use(auth);

router.get('/', getUserNotes);
router.post('/', noteCreation);

router.get('/:id', getNote);
router.put('/:id', updateNote);
router.patch('/:id/complete', noteComplete);
router.delete('/:id', deleteNote);

router.post('/:id/items', addItem);
router.patch('/:noteId/items/:itemId/toggle', toggleItemComplete);
router.delete('/:noteId/items/:itemId', deleteItem);

module.exports = router;