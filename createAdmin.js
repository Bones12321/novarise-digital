const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust if needed

// 🔐 Admin credentials
const adminData = {
  name: 'Admin',
  email: 'novariseteam@gmail.com',
  password: 'Admin123!', // You can change this if needed
  role: 'admin'
};

// 📦 Your MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/novariseDB'; // Change if your DB name differs

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🟢 Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists. Deleting and recreating...');
      await User.deleteOne({ email: adminData.email });
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const newAdmin = new User({
      name: adminData.name,
      email: adminData.email.toLowerCase(),
      password: hashedPassword,
      role: adminData.role
    });

    await newAdmin.save();
    console.log('✅ Admin user created successfully!');
  } catch (err) {
    console.error('❌ Error creating admin:', err);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

createAdmin();
