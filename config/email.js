const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Brevo SMTP connection error:', error);
  } else {
    console.log('Brevo SMTP connection successful');
  }
});

module.exports = transporter;
