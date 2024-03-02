const mongoose = require('mongoose');
const tweetSchema = require('./tweetSchema'); // Import the tweet schema
const jwt = require('jsonwebtoken');
const currentDate = new Date();

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true,trim: true },
  bio: { type: String, required: true, unique: true,trim: true },
  email: { type: String, required: true, unique: true,trim: true  },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true , trim: true   },
  tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }], // Reference to tweets
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Reference to followers
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Reference to users being followed
  bookmarked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }], // Reference to users being followed
  reposted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }], // Reference to users being followed
  liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }], // Reference to users being followed
  joined: {type:Date},
  dob:{type:Date},
  pimage:{type:String},
  country:{type:String},
  commented: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }], // Reference to tweets
  deleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  tokens: [{ 
      token: { type: String, required: true },
      lastLogin: {
        type: Date,
        default: currentDate
      } 
    }],
  forgetPass: {
      otp: {
        type: String,
        default: null,
    },
    otpGeneratedAt: {
        type: Date,
        default: null,  
    }
  }
  
});

// Pre-save middleware to hash the password and generate a JWT token
userSchema.methods.generateAuthToken = async function (){
  
  try{
      const token = jwt.sign({_id:this._id.toString()},"mynameisnusarathaveliwalaiammcastudent")
      this.tokens = this.tokens.concat({token:token})
      await this.save();
      console.log("Token Genrated: ")
      return token;
      
  }catch(err){
      return err;
  }

  
}


// Pre-save middleware to hash the password and generate a JWT token
userSchema.methods.generateAuthTokeno = async function() {
  try {
      const token = jwt.sign({ _id: this._id.toString() }, "yourSecretKeyHere", { expiresIn: '1h' });
      this.tokens = this.tokens.concat({ token });
      await this.save();
      return token;
  } catch (err) {
      throw err;
  }
};
const User = mongoose.model('User', userSchema);


module.exports = User;
