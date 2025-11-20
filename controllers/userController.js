const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const product = require("../models/product");
require("dotenv").config();
const sendMail = require("../utils/mailer");

//! Register User
module.exports.renderRegister = (req, res) => {
  res.render("user/userRegister.ejs");
};

module.exports.register = async (req, res) => {
  const { username, email, password, address } = req.body;
  try {
    const hashPass = await bcrypt.hash(password, 12);
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({ message: "User already registerd" });
    }
    const newUser = new User({ username, email, password: hashPass, address });

    await newUser.save();
  
    
    // Send welcome email
    await sendMail(
      email,
      "Welcome to Our Platform",
      `<h2>Hello ${username}, your registration was successful!</h2>`
    );

    res.redirect("/login");
  } catch (err) {
    console.log(`Register User Error : ${err.message}`);
  }
};

//! user Login
module.exports.renderLogin = (req, res) => {
  res.render("user/userLogin.ejs");
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    // return res.status(401).json({message:"User not registerd, Please register first"})
    req.flash("error", "User not registered, Please register first");
    return res.redirect("/login");
  }

  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    res.redirect("/login");
  }

  const token = jwt.sign(
    { userId: user._id, role: "user" },
    process.env.JWT_SECRET
  );
  res.cookie("userToken", token, { httpOnly: true });

  res.redirect("/shop");
  // res.send("Login successfull")
};

//! User LogOut

module.exports.logout = async (req, res) => {
  res.clearCookie("userToken");
  //  req.flash('error', 'LogOut successfully');
  res.redirect("/shop");
};

//! Shop page
module.exports.renderProducts = async (req, res) => {
  const products = await product.find();
  res.render("user/shopPage.ejs", { products });
};
