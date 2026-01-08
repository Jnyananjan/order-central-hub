// ⚠️ REPLACE THIS WITH YOUR RAZORPAY KEY ID
// Get it from: https://dashboard.razorpay.com/app/keys
export const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';

export const razorpayConfigured = RAZORPAY_KEY_ID !== 'YOUR_RAZORPAY_KEY_ID';

if (!razorpayConfigured) {
  console.warn('⚠️ Razorpay key not configured. Please update src/config/razorpay.ts');
}
