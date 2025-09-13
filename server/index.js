require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-welcome-email', async (req, res) => {
  const { email, fullName, rollNo } = req.body;

  if (!email || !fullName || !rollNo) {
    return res.status(400).json({ error: 'Missing required student data for email.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Welcome to Student Management - ${fullName}!`,
    html: `
      <h1>Welcome, ${fullName}!</h1>
      <p>Your enrollment with Roll Number <strong>${rollNo}</strong> has been successfully processed.</p>
      <p>We are excited to have you on board.</p>
      <p>Best regards,</p>
      <p>The Student Management Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    res.status(200).json({ message: 'Welcome email sent successfully!' });
  } catch (error) {
    console.error(`Error sending welcome email to ${email}:`, error);
    res.status(500).json({ error: 'Failed to send welcome email.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
