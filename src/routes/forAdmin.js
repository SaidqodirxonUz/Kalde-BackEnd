const express = require("express");
const genValidator = require("../shared/validator");
const controllers = require("../controllers/admin");
const schemas = require("../controllers/admin/schemas");
const { isLoggedIn } = require("../shared/auth");

const router = express.Router();

router.post(
  "/login",
  genValidator(schemas.loginAdminSchema),
  controllers.loginAdmin
);
router.patch("/admin/me", isLoggedIn, controllers.patchAdmin);

router.get("/admin", isLoggedIn, controllers.getAdmin);

router.get("/admin/:id", isLoggedIn, controllers.showAdmin);
module.exports = router;
