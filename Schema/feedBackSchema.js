const mongoose = require('mongoose');

// Define the schema for feedback
const feedbackSchema = new mongoose.Schema({
  // The email of the user who gave the feedback
  userEmail: {
    type: String,
    required: true
  },
  // The star rating given by the user
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  // Optional text feedback/comment
  comment: {
    type: String
  },
  // Timestamp for when the feedback was submitted
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model for the feedback schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
