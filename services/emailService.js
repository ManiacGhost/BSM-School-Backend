const transporter = require('../config/email');
require('dotenv').config();

const sendContactConfirmation = async (firstName, email, message) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f4c430; padding: 20px; text-align: center; }
          .header h1 { margin: 0; color: #000; }
          .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; }
          .message-box { background-color: #fff; border-left: 4px solid #f4c430; padding: 15px; margin: 15px 0; }
          .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
          .button { background-color: #f4c430; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 BSM School</h1>
          </div>
          
          <div class="content">
            <h2>Thank you for contacting us, ${firstName}!</h2>
            
            <p>We have received your enquiry and appreciate you taking the time to reach out to us. Our team will review your message and get back to you as soon as possible.</p>
            
            <div class="message-box">
              <strong>Your Message:</strong>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <h3>What happens next?</h3>
            <ul>
              <li>Our team will review your enquiry within 24 hours</li>
              <li>You will receive a response at this email address</li>
              <li>If urgent, please contact support directly</li>
            </ul>
            
            <h3>Need immediate help?</h3>
            <p>
              <strong>Support Email:</strong> ${process.env.SUPPORT_EMAIL}<br>
              <strong>Support Phone:</strong> ${process.env.SUPPORT_PHONE}
            </p>
          </div>
          
          <div class="footer">
            <p>© 2026 BSM School. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.BREVO_FROM_EMAIL,
    to: email,
    subject: 'We received your enquiry - BSM School',
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

const sendAdminNotification = async (firstName, email, phoneNumber, message) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f4c430; padding: 20px; text-align: center; }
          .header h1 { margin: 0; color: #000; }
          .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; }
          .info-box { background-color: #fff; border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #f4c430; }
          .message-content { background-color: #fffacd; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Contact Enquiry</h1>
          </div>
          
          <div class="content">
            <h2>You have a new enquiry from the contact form</h2>
            
            <div class="info-box">
              <div class="info-row">
                <span class="label">Name:</span> ${firstName}
              </div>
              <div class="info-row">
                <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
              </div>
              <div class="info-row">
                <span class="label">Phone:</span> ${phoneNumber || 'Not provided'}
              </div>
              <div class="info-row">
                <span class="label">Received:</span> ${new Date().toLocaleString()}
              </div>
            </div>
            
            <h3>Message:</h3>
            <div class="message-content">
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <h3>Action Required</h3>
            <p>Please review this enquiry and respond to the user at your earliest convenience.</p>
          </div>
          
          <div class="footer">
            <p>© 2026 BSM School. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.BREVO_FROM_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Enquiry from ${firstName}`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendContactConfirmation,
  sendAdminNotification,
};
