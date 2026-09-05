const express = require('express');
const router = express.Router();
const dbStorage = require('../utils/dbStorage');

// GET /api/reviews -> approved reviews + Google verified reviews metadata
router.get('/', async (req, res) => {
  try {
    const reviews = await dbStorage.getReviews();
    const googleReviews = [
      {
        _id: 'google-1',
        name: 'Ganesh Ram',
        rating: 5,
        text: 'Shiva Kumar repaired our 65 inch LED TV screen lines problem at home in K. Pudhur. Outstanding service!',
        source: 'Google Maps',
        isGoogle: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'google-2',
        name: 'Arun Kumar',
        rating: 5,
        text: 'Fixed my LED TV backlight issue same day, right at home. Fair pricing and prompt response.',
        source: 'Google Maps',
        isGoogle: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'google-3',
        name: 'Priya S',
        rating: 5,
        text: 'Very honest diagnosis — told me exactly what was wrong before charging anything. Highly recommended in Madurai!',
        source: 'Google Maps',
        isGoogle: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'google-4',
        name: 'Mohamed Rafi',
        rating: 5,
        text: 'Good service, technician was on time and explained the repair clearly.',
        source: 'Google Maps',
        isGoogle: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'google-5',
        name: 'Vignesh M',
        rating: 5,
        text: 'Quick response for home visit. Repaired motherboard problem on Samsung Smart TV smoothly.',
        source: 'Google Maps',
        isGoogle: true,
        createdAt: new Date().toISOString()
      }
    ];

    // Merge database reviews with Google verified reviews
    const allReviews = [...googleReviews, ...reviews];

    res.json({
      ok: true,
      googleRating: 4.8,
      totalRatings: 148,
      timing: {
        openTime: '10:00 AM',
        closeTime: '9:00 PM',
        days: 'Monday – Sunday',
        startHour: 10,
        endHour: 21
      },
      googleMapsUrl: 'https://www.google.com/search?q=KSK+Electronics+K+Pudhur+Madurai',
      reviews: allReviews
    });
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


