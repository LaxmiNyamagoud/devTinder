const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");

const app = express(); //Create an Express application

app.use(express.json()); //Middleware to parse JSON request bodies

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
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        res.send("Login successful!!");
      } else {
        throw new Error("Invalid credentials");
      }
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
})

// API endpoint to get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.send("Something went wrong");
  }
});

// API endpoint to get a user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      return res.send("User not found");
    }

    res.send(user);
  } catch (err) {
    res.send("Something went wrong");
  }
});

app.delete("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.send("Something went wrong");
  }
});

// API endpoint to update a user by ID
app.patch("/user", async (req, res) => {
  const userId = req.query.userId;
  const updateData = req.body;

  try {
    const allowedUpdates = ["photoUrl", "gender", "about", "skills"];
    const isUpdateAllowed = Object.keys(updateData).every((key) => {
      return allowedUpdates.includes(key);
    });

    if (!isUpdateAllowed) {
      throw new Error("Invalid updates!");
    }

    if (updateData?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const newUpdate = await User.findByIdAndUpdate(userId, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send("User updated successfully");
  } catch (err) {
    res.send("Update Failed: " + err.message);
  }
});

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
