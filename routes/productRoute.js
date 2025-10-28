const express = require("express");
const router = express.Router();
const {addProduct,renderAddProduct, renderEdit,editProduct, deleteProduct} = require('../controllers/productController')


router.get("/new", renderAddProduct)
// router.get("/login", renderLogin)
// router.get("/" , renderAdminPage)

router.post("/", addProduct)
router.get("/:id/edit", renderEdit)
router.put("/:id", editProduct)
router.delete("/:id", deleteProduct)



module.exports= router;
