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

// Generate verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    // Check if email is configured
    if (!isEmailConfigured()) {
      console.warn('Email configuration missing - cannot send verification email');
      return false;
    }

    // Use BASE_URL or NEXT_PUBLIC_APP_URL for deployment
    const appUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    if (!process.env.BASE_URL && !process.env.NEXT_PUBLIC_APP_URL) {
      console.warn('BASE_URL or NEXT_PUBLIC_APP_URL is not configured - using fallback URL');
    }

    const verificationUrl = `${appUrl}/verify?token=${token}`;
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Thank you for signing up! Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Verify Email
          </a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}; 