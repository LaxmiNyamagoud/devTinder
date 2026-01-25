const express = require('express');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require("bcrypt");
const User = require('../model/user');
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.send("Logout successful");
})

module.exports = authRouter;