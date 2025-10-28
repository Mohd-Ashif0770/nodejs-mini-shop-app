const Admin = require("../models/admin")
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')
const product = require("../models/product")
require('dotenv').config();


//! Register Admin
module.exports.renderRegister= (req, res)=>{
  res.render("admin/adminRegister.ejs")
}

module.exports.register= async (req, res)=>{
  const {name, email, password}= req.body;
  const hashPass= await bcrypt.hash(password, 12)
  const admin = await Admin.find();
  if(admin && admin.length>0){
    return res.status(401).json({message:"Admin already registerd"})
  }
  const registerdAdmin= new Admin({name, email, password:hashPass })

   await registerdAdmin.save()

  // res.send("Admin Added")
  res.redirect('/admin/login')
}

//! Admin Login
module.exports.renderLogin= (req, res)=>{
  res.render("admin/adminLogin.ejs")
}

module.exports.login= async (req, res)=>{
  const {email, password}= req.body;
  const admin = await Admin.findOne({email:email});
  
   if (!admin) {
      return res.status(401).json({ message: "Admin not found. Please check your credentials." });
    }
  
  const result = await bcrypt.compare(password, admin.password);
  if(!result){
    res.redirect("/admin/login");
  }
  const token = jwt.sign({ adminId: admin._id, role: "admin" }, process.env.JWT_SECRET);
  res.cookie("adminToken", token, { httpOnly: true });

  res.redirect("/admin");
  
}


module.exports.renderAdminPage= async(req, res)=>{
  const products = await product.find();

  res.render("admin/adminProfile.ejs", {products})
}


//! Admin LogOut

module.exports.logout= async(req, res)=>{
   res.clearCookie("token");
  //  req.flash('error', 'LogOut successfully');
  res.redirect("/admin/login");
}

