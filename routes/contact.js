const express = require('express');
const router = express.Router();
const {
  submitEnquiry,
  getEnquiries,
  getEnquiryById,
  markAsRead,
  deleteEnquiry,
} = require('../controllers/contactController');

// Submit enquiry
router.post('/submit', submitEnquiry);

// Get all enquiries
router.get('/', getEnquiries);

// Get single enquiry
router.get('/:id', getEnquiryById);

// Mark as read
router.put('/:id/read', markAsRead);

// Delete enquiry
router.delete('/:id', deleteEnquiry);

module.exports = router;
