const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 10,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email ID");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    photoUrl: {
      type: String,
      default: "https://www.shutterstock.com/image-vector/custom-default-profile-picture-icon-260nw-2359133587.jpg",
    },
    gender: {
      type: String,
      validate: (gender) => {
        return ["Male", "Female", "Other"].includes(gender);
      },
    },
    about: {
      type: String,
      default: "This is a default about section.",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function(){
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
  return token;
}

userSchema.methods.validatePassword = async function(passwordInput){
  const user = this;
  const passwordHash = user.password;
  const isPasswordMatch = await bcrypt.compare(passwordInput, passwordHash);
  return isPasswordMatch;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
