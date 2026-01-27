const express = require('express');
const userRoute = express.Router();
const { userAuth } = require('../middlewares/userAuth');
const connectionRequestModel = require("../model/connectionRequest");

const User_SAFE_DATA = ['firstName', 'lastName', 'age', 'photoUrl', 'gender', 'about', 'skills'];

userRoute.get('/user/requests', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.User;

        const requests = await connectionRequestModel.find({ toUserId: loggedInUser._id, status: 'interested' }).populate('fromUserId', User_SAFE_DATA);
        // const requests = await connectionRequestModel.find({toUserId: loggedInUser._id, status:'interested'}).populate('fromUserId', 'firstName lastName age photoUrl gender about skills');

        res.json({ data: requests });
    }
    catch (err) {
        res.send("ERROR:" + err.message);
    }
});

userRoute.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.User;

        const connections = await connectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate('fromUserId', User_SAFE_DATA).populate('toUserId', User_SAFE_DATA);

        const data = connections.map(connection => connection.fromUserId._id.equals(loggedInUser._id) ? connection.toUserId : connection.fromUserId);

        res.json({ data: data });
    } catch (err) {
        res.send("ERROR:" + err.message);
    }
})

module.exports = userRoute

