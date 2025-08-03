const cron = require('node-cron');
const User = require('../models/User');

// Runs every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const result = await User.updateMany(
      {
        verified: false,
        verificationTokenExpires: { $lt: now },
      },
      {
        $unset: { verificationToken: '', verificationTokenExpires: '' },
      }
    );
    console.log(`🧹 Expired tokens removed: ${result.modifiedCount}`);
  } catch (err) {
    console.error('Cron job failed:', err.message);
  }
});
