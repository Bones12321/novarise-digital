function verificationEmail(name, url) {
  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Hello ${name},</h2>
    <p>Thank you for registering! Please verify your email by clicking the link below:</p>
    <a href="${url}" style="background-color: #007BFF; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>If you did not sign up for this account, please ignore this email.</p>
    <hr />
    <p>Best regards,<br>Your App Team</p>
  </div>
  `;
}

module.exports = { verificationEmail };
