const ContactEnquiry = require('../models/ContactEnquiry');
const { sendContactConfirmation, sendAdminNotification } = require('../services/emailService');
require('dotenv').config();

const submitEnquiry = async (req, res) => {
  try {
    const { first_name, phone_number, email, message } = req.body;

    // Validation
    if (!first_name || !email || !message) {
      return res.status(400).json({
        error: 'First name, email, and message are required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Insert into database using model
    const enquiry = await ContactEnquiry.create(first_name, phone_number, email, message);

    // Send emails asynchronously
    Promise.all([
      sendAdminNotification(first_name, email, phone_number, message),
      sendContactConfirmation(first_name, email, message),
    ]).catch((emailError) => {
      console.error('Email sending error:', emailError);
    });

    return res.status(201).json({
      message: 'Enquiry submitted successfully. Confirmation email sent.',
      data: enquiry,
    });
  } catch (error) {
    console.error('Submit enquiry error:', error);
    return res.status(500).json({ error: 'Failed to submit enquiry' });
  }
};

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await ContactEnquiry.getAll();

    return res.status(200).json({
      message: 'Enquiries retrieved successfully',
      data: enquiries,
      total: enquiries.length,
    });
  } catch (error) {
    console.error('Fetch enquiries error:', error);
    return res.status(500).json({ error: 'Failed to retrieve enquiries' });
  }
};

const getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await ContactEnquiry.getById(id);

    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    return res.status(200).json({
      message: 'Enquiry retrieved successfully',
      data: enquiry,
    });
  } catch (error) {
    console.error('Fetch enquiry error:', error);
    return res.status(500).json({ error: 'Failed to retrieve enquiry' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE contact_enquiries
      SET is_read = TRUE
      WHERE id = $1
      RETURNING id, first_name, phone_number, email, message, created_at, is_read
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    return res.status(200).json({
      message: 'Enquiry marked as read',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    return res.status(500).json({ error: 'Failed to mark enquiry as read' });
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM contact_enquiries WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    return res.status(200).json({
      message: 'Enquiry deleted successfully',
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Delete enquiry error:', error);
    return res.status(500).json({ error: 'Failed to delete enquiry' });
  }
};

module.exports = {
  submitEnquiry,
  getEnquiries,
  getEnquiryById,
  markAsRead,
  deleteEnquiry,
};
