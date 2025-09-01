// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create SMTP transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465, // true for 465 (SSL), false for other ports (TLS)
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Only for development/testing
    },
    // Additional options for better compatibility
    pool: true,
    maxConnections: 1,
    rateDelta: 20000,
    rateLimit: 5,
  });

  // Verify SMTP connection
  try {
    await transporter.verify();
    console.log('SMTP Server is ready to take our messages');
  } catch (error) {
    console.error('SMTP Server connection failed:', error);
    throw new Error('Email service is not available');
  }

  // Define email options
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
    // Optional: Add plain text version
    text: options.text || options.message.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
  };

  // Send email with retry logic
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      attempt++;
      console.error(`Email sending attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to send email after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
};

module.exports = sendEmail;