const express = require("express");
const router = express.Router();
const {renderRegister,register, renderLogin, login, renderProducts, logout, renderVerifyOtp, verifyOtp} = require('../controllers/userController')


router.get("/register", renderRegister)
router.get("/login", renderLogin)
router.get("/logout", logout)
router.get("/shop", renderProducts)


router.post("/register", register)
router.post("/login", login)

router.get("/verify-otp", renderVerifyOtp);
router.post("/verify-otp", verifyOtp);

module.exports= router;