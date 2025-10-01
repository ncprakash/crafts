import nodemailer from 'nodemailer';

const isEmailConfigured = () => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

// Create transporter
const createTransporter = () => {
  if (!isEmailConfigured()) {
    throw new Error(
      'Email configuration is missing. Please set EMAIL_USER and EMAIL_PASS environment variables.'
    );
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Send email function
export const sendPaymentSuccessEmail = async (
  to: string,
  customerName: string,
  orderId: string,
  total: number
) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Gunnal Crafts" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Payment Successful - Gunnal Crafts',
    html: `
      <h2>Payment Successful</h2>
      <p>Hi ${customerName},</p>
      <p>Your payment of ₹${total.toFixed(2)} has been successfully received.</p>
      <p>Order ID: ${orderId}</p>
      <p>Thank you for shopping with us!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Payment success email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
