const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

// handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shuting down the server due to uncaught Exception");
  process.exit(1);
});

// env file config
dotenv.config({ path: "backend/config/config.env" });

// database
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`server is runing on http://192.168.100.4:${process.env.PORT}`);
});

// unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shuting down the server due to unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
