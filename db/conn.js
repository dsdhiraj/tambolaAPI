const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log("Connected to Database");
}).catch(()=>{
    console.log("Connection Unsuccessfull");
})