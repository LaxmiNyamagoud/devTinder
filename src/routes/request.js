const express = require('express');
const {userAuth} = require("../middlewares/userAuth");

const requestRouter = express.Router();

requestRouter.post("/sendconnectionrequest", userAuth, async (req, res) => {
    const user = req.User;
    res.send(user.firstName + " " + "sent connection request");
})

module.exports = requestRouter;