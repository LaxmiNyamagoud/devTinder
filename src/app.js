const express = require("express")  

const app = express(); //Create an Express application

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
}); //Start the server on port 3000

app.use('/',(req,res)=>{
   res.send("Hello, World! Dashboard.");
})

app.use('/test',(req,res)=>{
res.send("This is a test route.");
})