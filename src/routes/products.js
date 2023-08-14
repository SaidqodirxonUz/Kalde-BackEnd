const express = require("express");
const genValidator = require("../shared/validator");
const { isLoggedIn } = require("../shared/auth");
const {
  postProductsSchema,
  patchProductsSchema,
} = require("../controllers/products/schemas/index");
const productsController = require("../controllers/products");
const upload = require("../uploads");

const router = express.Router();

const mPostProducts = [
  upload.array("image"),
  isLoggedIn,

  genValidator(postProductsSchema),
];
const mPatchProducts = [
  upload.array("image"),
  isLoggedIn,

  genValidator(patchProductsSchema),
];

const mDeleteProducts = [isLoggedIn];

router.post("/products", mPostProducts, productsController.postProducts);
router.get("/products", productsController.getProducts);
router.get("/products/news", productsController.newProducts);
router.get("/products/:id", productsController.showProducts);
router.patch("/products/:id", mPatchProducts, productsController.patchProducts);
router.delete(
  "/products/:id",
  mDeleteProducts,
  productsController.deleteProducts
);
module.exports = router;
