const express = require('express');
const app = express();
const dbConnect = require("./Mongoose/connect.js")
const userSchema = require('./Schema/userSchema.js'); // Import the user schema
const tweetSchema = require("./Schema/tweetSchema.js")
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const auth = require("./Auth/auth.js")
const jwt = require('jsonwebtoken');
const multer = require('multer');
const countryList = require('./Auth/country.js');
const nodemailer = require('nodemailer');
const feedBackRoute = require('./Route/feedBackRoute.js');
const userRoutes = require('./Route/userRoute.js');

//const 

// Configure multer for handling file uploads
const upload = multer();

dbConnect();

//console.log(countryList)
// Middleware to parse JSON in the request body
app.use(express.json());

// cookie parser
app.use(cookieParser());

// 
app.use(cors({ credentials: true, origin: 'https://fff-eh6g.onrender.com' }));


// using tweet routes
app.use('/feedBackroutes', feedBackRoute);



app.listen(4000, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", 4000);
})
