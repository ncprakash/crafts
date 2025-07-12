# Razorpay Payment Gateway Setup

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Getting Razorpay Credentials

1. **Sign up for Razorpay**: Go to https://razorpay.com and create an account
2. **Get API Keys**: 
   - Go to Settings > API Keys
   - Generate a new key pair
   - Copy the Key ID and Key Secret

## Database Migration

Run the following command to add payment fields to the Order table:

```bash
npx prisma migrate dev --name add_payment_fields
```

## Features Implemented

### ✅ Payment Flow
1. **Order Creation**: Creates order in database first
2. **Payment Order**: Creates Razorpay order
3. **Payment Gateway**: Opens Razorpay checkout
4. **Payment Verification**: Verifies payment signature
5. **Order Update**: Updates order with payment details
6. **Cart Clearing**: Clears cart after successful payment

### ✅ Security Features
- **Payment Signature Verification**: Ensures payment authenticity
- **User Authentication**: Only authenticated users can make payments
- **Order Ownership**: Users can only update their own orders

### ✅ User Experience
- **Seamless Integration**: Payment popup with pre-filled details
- **Error Handling**: Comprehensive error messages
- **Success Flow**: Automatic cart clearing and redirect
- **Branded Theme**: Custom colors matching your brand

## API Endpoints

### `/api/payment/create-order`
- Creates Razorpay order
- Returns order ID and amount

### `/api/payment/verify`
- Verifies payment signature
- Ensures payment authenticity

### `/api/orders/[id]/update-payment`
- Updates order with payment details
- Changes order status to 'processing'

## Testing

### Test Mode
Use Razorpay test credentials for development:
- Test cards available in Razorpay dashboard
- No real money charged in test mode

### Production Mode
- Use live credentials for production
- Real payments will be processed

## Payment Flow Diagram

```
User clicks "Place Order"
    ↓
Create order in database
    ↓
Create Razorpay order
    ↓
Open Razorpay checkout
    ↓
User completes payment
    ↓
Verify payment signature
    ↓
Update order status
    ↓
Clear cart & show success
```

## Troubleshooting

### Common Issues
1. **Payment not processing**: Check Razorpay credentials
2. **Verification failed**: Ensure key secret is correct
3. **Order not updating**: Check database connection
4. **Cart not clearing**: Verify cart context is working

### Debug Steps
1. Check browser console for errors
2. Verify environment variables are set
3. Test with Razorpay test credentials
4. Check network tab for API calls 