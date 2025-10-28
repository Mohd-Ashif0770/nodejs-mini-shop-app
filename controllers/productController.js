const Admin = require("../models/admin")
const Product = require("../models/product")
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')


//! add Product
module.exports.renderAddProduct= (req, res)=>{
  res.render("product/addProduct.ejs")
}

module.exports.addProduct= async(req, res)=>{
  const {name, description, price, category,image} = req.body;

  const product = new Product({name, description, price, category,image});
  const savedProduct = await product.save();
  // res.status(201).json({message:"Product added", product:savedProduct});
  res.redirect("/admin")  
}

//! Edit Product
module.exports.renderEdit= async(req, res)=>{
  const {id} = req.params;
  const product = await Product.findById(id)
  res.render("product/editProduct.ejs", {product})
}

module.exports.editProduct= async(req, res)=>{
  const {id} = req.params;
  const {name, description, price, category,image} = req.body;
  const product = await Product.findByIdAndUpdate(id, {name, description, price, category,image}, {new:true})
  // res.status(200).json({message:"Product Updated", product})
  res.redirect("/admin")
}

//! Delete Product
module.exports.deleteProduct= async(req, res)=>{
  const {id} = req.params;  
  await Product.findByIdAndDelete(id);
  // res.status(200).json({message:"Product Deleted"})
  res.redirect("/admin")
}