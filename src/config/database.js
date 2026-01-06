const mongoose = require('mongoose');

const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://learningnodeitt:eGlqSN7pyoiY4UKT@learningnode.scjeoxw.mongodb.net/devTinder')
};

module.exports = connectDB;