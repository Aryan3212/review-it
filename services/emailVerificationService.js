const isVerifiedEmail = async (email) => {
    const response = await fetch(
    `${process.env.EMAIL_VERIFICATION_API_BASE_URL}?api_key=${process.env.EMAIL_VERIFICATION_API_KEY}&email=${email}`
  );
  const verification = await response.json();
  const isValid = verification.is_smtp_valid.value;
  return isValid;
};

module.exports = {
  isVerifiedEmail
};
