const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("./model/user");
const {userAuth} = require("./middlewares/userAuth");
const { validateSignUpData } = require("./utils/validation");

const app = express(); //Create an Express application

app.use(express.json()); //Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

app.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);

    //Encrypt the password
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      photoUrl,
      gender,
      about,
      skills,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    //Create a instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      photoUrl,
      gender,
      about,
      skills,
      password: passwordHash,
    });

    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    } else {
      const isPasswordMatch = await user.validatePassword(password);

      if (isPasswordMatch) {
        // Create JWT token
        const token = await user.getJWT();

        // store JWT token in cookie and send back to user
        res.cookie("token", token)
        res.send("Login successful!!");
      } else {
        throw new Error("Invalid credentials");
      }
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
})

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.User;
    res.send(user);
  } catch (err) {
    res.status(401).send("ERROR: " + err.message);
  }
})

app.post("/sendconnectionrequest",userAuth, async(req,res)=>{
  const user = req.User;
  res.send(user.firstName +" " + "sent connection request");
})

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
