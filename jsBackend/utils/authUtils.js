const crypto = require('crypto');

/**
 * Generate a 6-digit numeric OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a unique 8-character referral code
 */
const generateReferralCode = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
};

/**
 * Mock OTP sender
 * In a real application, you would integrate with Twilio (SMS) 
 * or Nodemailer (Email).
 */
const sendOTP = (target, otp) => {
    console.log(`[MOCK OTP SERVICE] Sending OTP ${otp} to ${target}`);
    // This simulates the latency of an external service
    return true;
};

module.exports = {
    generateOTP,
    generateReferralCode,
    sendOTP
};
