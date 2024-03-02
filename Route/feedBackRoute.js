const express = require('express');
const app = express();
const userSchema = require('../Schema/userSchema.js'); // Import the user schema
const tweetSchema = require("../Schema/tweetSchema.js")
const feedbackSchemaSchema = require("../Schema/feedBackSchema.js")
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const auth = require("../Auth/auth.js")
const jwt = require('jsonwebtoken');
const multer = require('multer');
const countryList = require('../Auth/country.js');
const nodemailer = require('nodemailer');
const upload = multer();
const router = express.Router();


// POST endpoint for creating a new tweet
router.post("/add-feedback",async (req,res)=>{
    
    try {

        
        
        const {email, comment, rating} = req.body;

        if(rating<=0 ||rating >5){
           
           return res.status(401).json({"message": "Rating Should in (1,5)" ,"err":true})
            
        }
    
        // Create a new tweet using the Tweet model
        const newFeedback = new feedbackSchemaSchema({
            userEmail:email,
            rating:rating,
            comment:comment
        });
    
        // Save the tweet to the database
        const savedFeedBack = await newFeedback.save();
        
        // Send the saved tweet as the response
        res.status(200).json({"message": "Feed Back Added" ,"err":false})
    } catch (error) {
      console.error('Error creating tweet:', error);
      res.status(500).json({ err: true ,message:"Srver error",error:error});
    }
  });



// GET endpoint to retrieve feedbacks with pagination and average rating
router.get("/get-feedback", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
  
      // Set pageSize to 5 for maximum 5 feedbacks per page
      const pageSize = 5;
  
      // Retrieve all feedbacks for calculating average rating
      const allFeedbacks = await feedbackSchemaSchema.find();
  
      // Calculate total number of feedbacks
      const totalFeedbacks = allFeedbacks.length;
  
      let feedbacks;
  
      // If requested page is greater than total pages or total pages is 0, return all feedbacks
      if (page > Math.ceil(totalFeedbacks / pageSize) || totalFeedbacks === 0) {
        feedbacks = allFeedbacks;
      } else {
        // Retrieve feedbacks with pagination
        feedbacks = await feedbackSchemaSchema.find()
          .sort({ createdAt: -1 })
          .skip((page - 1) * pageSize)
          .limit(pageSize);
      }
  
      // Calculate average rating
      const totalRating = allFeedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
      const averageRating = totalFeedbacks > 0 ? totalRating / totalFeedbacks : 0;
  
      // Send response with feedbacks, average rating, and pagination info
      res.status(200).json({err:false,message:"tweets are fetched", feedbacks, averageRating, currentPage: page, totalPages: Math.ceil(totalFeedbacks / pageSize), totalFeedbacks, pageSize });
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      res.status(500).json({err:true,message:"server error ", error: error });
    }
  });
  


// GET endpoint to retrieve feedbacks with pagination, filtering by rating, and average rating
router.get("/get-feedback-rating", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const ratingFilter = parseInt(req.query.rating) || 5; // Set default rating to 5 if not provided
  
      // Set pageSize to 5 for maximum 5 feedbacks per page
      const pageSize = 5;
  
      // Retrieve all feedbacks for calculating average rating
      const allFeedbacks = await feedbackSchemaSchema.find();
  
      // Apply rating filter if provided
      let filteredFeedbacks = allFeedbacks;
      if (!isNaN(ratingFilter) && ratingFilter >= 1 && ratingFilter <= 5) {
        filteredFeedbacks = allFeedbacks.filter(feedback => feedback.rating === ratingFilter);
      }
  
      // Calculate total number of feedbacks after filtering
      const totalFeedbacks = filteredFeedbacks.length;
  
      let feedbacks;
  
      // If requested page is greater than total pages or total pages is 0, return all filtered feedbacks
      if (page > Math.ceil(totalFeedbacks / pageSize) || totalFeedbacks === 0) {
        feedbacks = filteredFeedbacks;
      } else {
        // Retrieve feedbacks with pagination after filtering
        feedbacks = filteredFeedbacks.slice((page - 1) * pageSize, page * pageSize);
      }
  
      // Calculate average rating based on filtered feedbacks
      const totalRating = filteredFeedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
      const averageRating = totalFeedbacks > 0 ? totalRating / totalFeedbacks : 0;
  
      // Send response with filtered feedbacks, average rating, and pagination info
      res.status(200).json({ err: false, message: "Feedbacks fetched successfully", feedbacks, averageRating, currentPage: page, totalPages: Math.ceil(totalFeedbacks / pageSize), totalFeedbacks, pageSize });
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      res.status(500).json({ err: true, message: "Server error", error: error });
    }
  });
  
  
// Export the router
module.exports = router;
