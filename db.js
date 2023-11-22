const mongoose = require('mongoose');

const URL = "mongodb+srv://sumit123:6CAceaUjQlkWS1D5@cluster0.yieczle.mongodb.net/ImageGallery";

const connectDB = ()=>{
    try {
        mongoose.connect(URL).then(()=>{
            console.log("Connected to Database Successfuly");
        })
    } catch (error) {
        console.log("Error in connecting to Databse",{error})
    }

}

module.exports = connectDB;