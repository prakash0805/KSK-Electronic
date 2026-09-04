const express = require('express');
const router = express.Router();
const dbStorage = require('../utils/dbStorage');

// GET /api/reviews -> approved reviews, newest first
router.get('/', async (req, res) => {
  try {
    const reviews = await dbStorage.getReviews();
    res.json({ ok: true, reviews });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/reviews -> a customer leaves a review
router.post('/', async (req, res) => {
  try {
    const { name, rating, text } = req.body;
    if (!name || !rating || !text) {
      return res.status(400).json({ ok: false, error: 'Name, rating and text are required' });
    }
    const review = await dbStorage.addReview({ name, rating, text });
    res.status(201).json({ ok: true, review });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;


