const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("Trying... to connect...");
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // These are options are just to remove warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected`);
  } catch (error) {
    console.log("Error");
    console.log(`Error : ${error.message}`);
  }
};

exports.connectDB = connectDB;
