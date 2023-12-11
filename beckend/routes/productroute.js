const express = require("express");
const { getAllproducts, createProduct, updateProduct, deleteProduct, getProductDetails} = require("../controller/productcontroler");
const { isAuthenticateduser,authorizeRoles } = require("../middelware/auth");

const router = express.Router();

router.route("/products").get(getAllproducts);
router.route("/products/new").post(isAuthenticateduser,authorizeRoles("admin"),createProduct);
router.route("/products/:id").put(isAuthenticateduser,authorizeRoles("admin"),updateProduct).delete(isAuthenticateduser,authorizeRoles("admin"),deleteProduct).get(getProductDetails);


module.exports = router;