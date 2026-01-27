const express = require('express');
const { userAuth } = require("../middlewares/userAuth");
const connectionRequestModel = require("../model/connectionRequest");
const User = require("../model/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.User._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const toUser = await User.findById(toUserId);

        if (!toUser) {
            return res.status(400).json({ message: "User not Found" });
        }

        const existingConnectionRequest = await connectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already exists" });
        }

        const connectionRequest = new connectionRequestModel({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({ message: "Connection request sent successfully", data });
    } catch (err) {
        res.send("ERROR:" + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{
    try{
        const allowedStatus = ["accepted", "rejected"];
        const {status,requestId} = req.params;
        const loggedInUser = req.User;

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status value"});
        }

        const connectRequest = await connectionRequestModel.findOne({_id:requestId, toUserId: loggedInUser._id, status:'interested'});

        if(!connectRequest){
            return res.status(400).json({message: "No connection request found"});
        }

        connectRequest.status = status;

        const data =await connectRequest.save();
        res.json({message:"Connection request reviewed successfully", data});
    }catch(err){
        res.send("ERROR:" + err.message);
    }
})

module.exports = requestRouter;