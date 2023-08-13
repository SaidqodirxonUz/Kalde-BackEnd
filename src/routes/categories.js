const express = require("express");
const genValidator = require("../shared/validator");
const { isLoggedIn, isAdmin, hasRole } = require("../shared/auth");
const {
  postCategoriesSchema,
  patchCategoriesSchema,
} = require("../controllers/categories/schemas");
const CategoriesController = require("../controllers/categories");
const upload = require("../uploads");

const router = express.Router();

const mPostCategories = [
  isLoggedIn,
  genValidator(postCategoriesSchema),
  upload.single("image"),
];
const mPatchCategories = [
  isLoggedIn,
  genValidator(patchCategoriesSchema),
  upload.single("image"),
];
const mDeleteCategories = [isLoggedIn];

router.post(
  "/categories",
  mPostCategories,
  CategoriesController.postCategories
);
router.get("/categories", CategoriesController.getCategories);
router.get("/categories/:id", CategoriesController.showCategories);
router.patch(
  "/categories/:id",
  mPatchCategories,
  CategoriesController.patchCategories
);
router.delete(
  "/categories/:id",
  mDeleteCategories,
  CategoriesController.deleteCategories
);
module.exports = router;
