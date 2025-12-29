const express = require("express")  

const app = express(); //Create an Express application

app.use('/user',(req,res,next)=>{
    console.log("User endpoint hit");
    next();
    // res.send("User endpoint response");
},(req,res)=>{
    console.log("Second middleware for /user 2");
    res.send("User endpoint response 2");

})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
}); //Start the server on port 3000