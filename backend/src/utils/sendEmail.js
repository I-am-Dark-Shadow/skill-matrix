import nodemailer from 'nodemailer';
import 'dotenv/config';

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports like 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use the App Password you generated
  },
});

/**
 * Sends an email using the pre-configured transporter
 * @param {string} to - The recipient's email address
 * @param {string} subject - The subject of the email
 * @param {string} html - The HTML body of the email
 */
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `Skill Matrix <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    // In a real application, you might want to throw the error
    // to be handled by the calling function.
  }
};

export default sendEmail;