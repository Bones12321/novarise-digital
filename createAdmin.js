// createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User"); // Adjust path if needed

// Admin credentials
const adminEmail = "novariseteam@gmail.com";
const adminPassword = "Flaffie12."; // Change before deploying
const adminName = "Admin User";

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("🟢 Connected to MongoDB");

    try {
      // Check if admin exists
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (existingAdmin) {
        console.log("⚠️ Admin user already exists. Deleting and recreating...");
        await User.deleteOne({ email: adminEmail });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Create admin user
      const adminUser = new User({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      await adminUser.save(); // Wait until saved in DB

      console.log("✅ Admin user created successfully!");
    } catch (error) {
      console.error("❌ Error creating admin user:", error);
    } finally {
      await mongoose.disconnect();
      console.log("🔌 Disconnected from MongoDB");
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
