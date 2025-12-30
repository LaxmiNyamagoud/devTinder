const express = require("express");

const {userAuth}=require("./middlewares/userAuth");

const app = express(); //Create an Express application

app.use("/", userAuth);

app.get("/user", (req,res)=>{
    res.send("User endpoint accessed");
})

app.post("/user", (req,res)=>{
    res.send("User account is created");
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
}); //Start the server on port 3000
