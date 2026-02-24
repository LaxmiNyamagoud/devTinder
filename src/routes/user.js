const express = require('express');
const User = require('../model/user');
const { userAuth } = require('../middlewares/userAuth');
const connectionRequestModel = require("../model/connectionRequest");
const userRoute = express.Router();

const User_SAFE_DATA = ['firstName', 'lastName', 'age', 'photoUrl', 'gender', 'about', 'skills', 'photoUrl'];

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
});

userRoute.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.User;
        let limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        limit = limit > 50 ? 50 : limit;

        const connectionRequests = await connectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideConnectedUsers = new Set();
        connectionRequests.forEach((request) => {
            hideConnectedUsers.add(request.fromUserId.toString());
            hideConnectedUsers.add(request.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideConnectedUsers) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(User_SAFE_DATA).skip(skip).limit(limit);

        res.send({ data: users });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

module.exports = userRoute

