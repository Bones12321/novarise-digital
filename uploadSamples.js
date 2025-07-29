const mongoose = require("mongoose");
const Product = require("./models/Product");
const sampleProducts = require("./sampleProducts");

mongoose
  .connect("mongodb://127.0.0.1:27017/beyond9to5", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});

    // Insert sample products for each section
    const productsToInsert = [];
    Object.entries(sampleProducts).forEach(([section, products]) => {
      products.forEach((prod) => {
        productsToInsert.push({ ...prod, section });
      });
    });

    await Product.insertMany(productsToInsert);
    console.log("Sample products uploaded");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
  });
