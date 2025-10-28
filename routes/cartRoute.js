const express = require("express");
const router = express.Router();
const {viewCart,addToCart,removeFromCart, updateCartItemQty} = require('../controllers/cartController')
const { checkLogin } = require('../middlewares');


// Cart routes

router.get("/", checkLogin, viewCart);
router.post("/add/:id", checkLogin, addToCart);
router.post("/remove/:id", checkLogin, removeFromCart);
router.post("/update/:id", checkLogin, updateCartItemQty);



module.exports= router;