# Email Verification Setup

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# Email Configuration (Gmail)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `EMAIL_PASS`

## How it Works

1. User fills out the sign-up form
2. System creates user with `isVerified: false`
3. Verification email is sent with a unique token
4. User clicks the verification link
5. System verifies the token and marks user as verified
6. User can now sign in

## Features

- ✅ Email verification with nodemailer
- ✅ Secure token generation
- ✅ 24-hour token expiration
- ✅ User-friendly verification page
- ✅ Database integration with Prisma
- ✅ Error handling and user feedback 