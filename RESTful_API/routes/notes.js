const express = require('express');
const Note = require('../models/Note');
const validateNote = require('../middleware/validateNote');
const router = express.Router();

// GET all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET a note by title
router.get('/:title', async (req, res) => {
  try {
    const note = await Note.findOne({ title: req.params.title });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new note
router.post('/', validateNote, async (req, res) => {
  try {
    const existingNote = await Note.findOne({ title: req.body.title });
    if (existingNote) {
      return res.status(400).json({ error: 'A note with this title already exists' });
    }
    const newNote = await Note.create(req.body);
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a note by title
router.post('/:title/edit', validateNote, async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { title: req.params.title },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedNote) return res.status(404).json({ error: 'Note not found' });
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a note by title
router.delete('/:title', async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ title: req.params.title });
    if (!deletedNote) return res.status(404).json({ error: 'Note not found' });
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
