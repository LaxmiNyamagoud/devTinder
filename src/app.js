const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express(); //Create an Express application

app.use(express.json()); //Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    }); //Start the server on port 3000
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
