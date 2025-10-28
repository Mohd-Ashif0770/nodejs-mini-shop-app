const jwt = require("jsonwebtoken");
require('dotenv').config();

//! Verify login for any authenticated user
function checkLogin(req, res, next) {
  const token = req.cookies.userToken;
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const user = jwt.verify(token,  process.env.JWT_SECRET);
    req.user = user; // store user info
    next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token, please login again");
  }
}

//! Verify if user is an Admin
function isAdmin(req, res, next) {
  const token = req.cookies.adminToken;
  if (!token) {
    return res.redirect("/admin/login");
  }

  try {
    const user = jwt.verify(token,  process.env.JWT_SECRET);
    
    if (user.role !== "admin") {
      return res.status(403).send("Access Denied: Admins only");
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token, please login again");
  }
}

module.exports = { checkLogin, isAdmin };
