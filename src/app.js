const express = require("express")  

const app = express(); //Create an Express application

//This will handle GET requests to the /user path
app.get('/user',(req,res)=>{
    console.log("User route accessed");
    res.send({message: "User route accessed successfully"});
})

//Dynamic route to handle userId parameter
app.get('/user/:userId',(req,res)=>{
    console.log(req.params);
    res.send({message: "User route accessed successfully"});
})

app.post('/user',(req,res)=>{
    res.send({message: "User created successfully"});
})

app.delete('/user',(req,res)=>{
    res.send({message: "User deleted successfully"});
})

app.use('/test',(req,res)=>{
res.send("This is a test route.");
})

//This will match all the http method api calls 
app.use('/',(req,res)=>{
   res.send("Hello, default path.");
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
}); //Start the server on port 3000