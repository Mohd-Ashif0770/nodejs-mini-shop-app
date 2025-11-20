const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const product = require("../models/product");
require("dotenv").config();
const sendMail = require("../utils/mailer");
const  {generateOTP}  = require("../utils/generateOTP");

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
    // const newUser = new User({ username, email, password: hashPass, address });

      // Generate OTP
    const otp = generateOTP();
    console.log("OTP:", otp);

    const newUser = new User({
      username,
      email,
      password: hashPass,
      address,
      otp,
      otpExpire: Date.now() + 5 * 60 * 1000, // valid for 5 min
    });

    await newUser.save();
  
    
  // !   Send welcome email
  //   await sendMail(
  //     email,
  //     "Welcome to Our Platform",
  //     `<h2>Hello ${username}, your registration was successful!</h2>`
  //   );
  //   res.redirect("/login");

   //! Send OTP Mail

    await sendMail(
      email,
      "Your OTP Verification Code",
      `
        <h2>Hello ${username}</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes.</p>
    `
    );

    // Redirect to OTP page
    res.redirect(`/verify-otp?email=${email}`);
  } catch (err) {
     console.log(`Register User Error : ${err.message}`);
  }
};

//! OTP Varification
module.exports.renderVerifyOtp = (req, res) => {
  const { email } = req.query;
  res.render("user/verifyOtp.ejs", { email });
};

module.exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "Invalid Email!");
    return res.redirect("/register");
  }

  if (user.otp !== otp) {
    req.flash("error", "Incorrect OTP!");
    return res.redirect(`/verify-otp?email=${email}`);
  }

  if (user.otpExpire < Date.now()) {
    req.flash("error", "OTP expired!");
    return res.redirect(`/verify-otp?email=${email}`);
  }

  // Mark as verified
  user.isVerified = true;
  user.otp = null;
  user.otpExpire = null;

  await user.save();

  req.flash("success", "OTP Verified! Please login.");
  res.redirect("/login");
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
