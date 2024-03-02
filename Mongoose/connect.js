
const mongoose = require("mongoose");
const url ='mongodb+srv://vajju:nusarat@cluster0.t6mxcqh.mongodb.net/twwiter?retryWrites=true&w=majority';

var dbConnect = ()=>{

    mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then((con)=>{
        console.log("MongoDb Is Connected");
        return con;
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports = dbConnect;