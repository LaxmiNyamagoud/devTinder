const express = require('express');
const { userAuth } = require("../middlewares/userAuth");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.User;
    res.send(user);
  } catch (err) {
    res.status(401).send("ERROR: " + err.message);
  }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const allowedEditFields = ["firstName","lastName","age","photoUrl","gender","about","skills"];
    const isEditAllowed = Object.keys(req.body).every((field)=> allowedEditFields.includes(field));

    if(!isEditAllowed){
      throw new Error("Invalid Edit Fields!");
    }

    const loggedInUser = req.User;

    Object.keys(req.body).forEach((field)=>loggedInUser[field]= req.body[field]);
    await loggedInUser.save();

    res.json({message: "Profile Updated Successfully!", data:loggedInUser});
  } catch (err) {
    res.send("ERROR:" + err.message)
  }
})

module.exports = profileRouter;