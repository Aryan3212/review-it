const { sanitizeEmail } = require('../utils');

const isVerifiedEmail = async (email) => {
    const cleanEmail = sanitizeEmail(email);
    if (process.env.EMAIL_VERIFICATION_ENABLED) {
        const response = await fetch(
            `${process.env.EMAIL_VERIFICATION_API_BASE_URL}?api_key=${process.env.EMAIL_VERIFICATION_API_KEY}&email=${cleanEmail}`
        );
        const verification = await response.json();
        const isValid = verification.is_smtp_valid.value;
        return isValid;
    }
    return true;
};

module.exports = {
    isVerifiedEmail
};
