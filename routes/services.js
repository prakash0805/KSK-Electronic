const express = require('express');
const router = express.Router();
const dbStorage = require('../utils/dbStorage');

// GET /api/services -> powers the service cards grid on the website
router.get('/', async (req, res) => {
  try {
    const services = await dbStorage.getServices();
    res.json({ ok: true, services });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;


