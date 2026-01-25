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
    

  } catch (err) {
    res.send("ERROR:" + err.message)
  }
})

module.exports = profileRouter;