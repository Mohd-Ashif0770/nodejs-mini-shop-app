const mongoose= require('mongoose');
const dotenv= require('dotenv');


// Load environment variables from .env file
dotenv.config();

const connectDB= async()=>{
  try{
    const conn= await mongoose.connect(process.env.MONGODB_URL);
    console.log("connection created with mongoDB");
    // return true

  }catch(err){
    console.log(err)
    // return false
  }
}

module.exports=connectDB;