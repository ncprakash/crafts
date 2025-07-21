import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Check if email configuration is available
const isEmailConfigured = () => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

// Create a transporter using Gmail SMTP
const createTransporter = () => {
  if (!isEmailConfigured()) {
    throw new Error('Email configuration is missing. Please set EMAIL_USER and EMAIL_PASS environment variables.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: true,
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Generate a 32-byte hex token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send a styled verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    if (!isEmailConfigured()) {
      console.warn('Email configuration missing - cannot send verification email');
      return false;
    }

    const appUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      console.warn('Missing BASE_URL or NEXT_PUBLIC_APP_URL in environment. Using fallback localhost.');
    }

    const baseUrl = appUrl || 'https://your-domain.com'; // replace with your actual domain as fallback
    const verificationUrl = `${baseUrl}/verify?token=${token}`;

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Verify Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Verify Your Email Address',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50;">👋 Welcome!</h2>
          <p style="font-size: 16px; color: #333;">Thanks for signing up! Please confirm your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Verify Email
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this URL into your browser:</p>
          <p style="font-size: 13px; word-break: break-all; color: #999;">${verificationUrl}</p>
          <p style="font-size: 13px; color: #aaa;">This link will expire in 24 hours.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};
