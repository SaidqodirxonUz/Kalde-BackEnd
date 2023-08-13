const express = require("express");
const genValidator = require("../shared/validator");
const controllers = require("../controllers/admin");
const schemas = require("../controllers/admin/schemas");

const router = express.Router();

router.post(
  "/login",
  genValidator(schemas.loginAdminSchema),
  controllers.loginAdmin
);

module.exports = router;
