import Flutterwave from 'flutterwave-node-v3';

if (!process.env.FLUTTERWAVE_PUBLIC_KEY || !process.env.FLUTTERWAVE_SECRET_KEY) {
  // Warn in development, or throw in production
  console.warn('Flutterwave keys are missing from environment variables.');
}

// Initialize Flutterwave SDK
const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-SANDBOX',
  process.env.FLUTTERWAVE_SECRET_KEY || 'FLWSECK_TEST-SANDBOX'
);

export default flw;
