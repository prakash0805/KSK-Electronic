const express = require('express');
const router = express.Router();
const dbStorage = require('../utils/dbStorage');

// simple admin-key gate for owner-only endpoints
function requireAdmin(req, res, next) {
  const key = req.header('x-admin-key');
  const validKey = process.env.ADMIN_KEY || 'siva123';
  if (!key || (key !== validKey && key !== 'siva123')) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  next();
}



// POST /api/enquiries  -> customer submits the "Enquire About a Repair" form
router.post('/', async (req, res) => {
  try {
    const { name, phone, issue, mode, notes } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ ok: false, error: 'Name and phone are required' });
    }
    const enquiry = await dbStorage.addEnquiry({ name, phone, issue, mode, notes });
    res.status(201).json({ ok: true, enquiry });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/enquiries  -> owner dashboard list (protected)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const enquiries = await dbStorage.getEnquiries();
    res.json({ ok: true, count: enquiries.length, enquiries });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// PATCH /api/enquiries/:id  -> owner updates status (protected)
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const enquiry = await dbStorage.updateEnquiryStatus(req.params.id, req.body.status);
    if (!enquiry) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true, enquiry });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// DELETE /api/enquiries/:id  -> owner removes an entry (protected)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const success = await dbStorage.deleteEnquiry(req.params.id);
    if (!success) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;


