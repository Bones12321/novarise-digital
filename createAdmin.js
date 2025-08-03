require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import your User model (adjust path as needed)
const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const email = 'novariseteam@gmail.com';
    const plainPassword = 'Flaffie12';

    // Check if admin user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Create new admin user
    user = new User({
      name: 'Admin',
      email: email,
      password: hashedPassword,
      role: 'admin',  // IMPORTANT: admin role
    });

    await user.save();
    console.log('Admin user created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
}

createAdmin();
