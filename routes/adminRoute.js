const express = require("express");
const router = express.Router();
const {renderRegister, register, renderLogin, login, renderAdminPage, logout} = require('../controllers/adminController')
const {checkLogin, isAdmin}= require('../middlewares')


router.get("/register", renderRegister)
router.get("/login", renderLogin)
router.get("/" ,isAdmin, renderAdminPage)

router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)



module.exports= router;











