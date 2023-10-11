const express = require("express");
const genValidator = require("../shared/validator");
const { isLoggedIn, hasRole } = require("../shared/auth");
const {
  postDealersSchema,
  patchDealersSchema,
} = require("../controllers/dealers/schemas/index");
const dealersController = require("../controllers/dealers");
const upload = require("../uploads");

const router = express.Router();

const sPostDealers = [isLoggedIn, genValidator(postDealersSchema)];
// const sGetDealers = [isLoggedIn];
// const mShowDealers = [isLoggedIn];

const sPatchDealers = [isLoggedIn, genValidator(patchDealersSchema)];

const mDeleteDealers = [isLoggedIn];

router.post("/dealers", sPostDealers, dealersController.postDealers);

router.get("/dealers", dealersController.getDealers);

router.get("/dealers/:id", dealersController.showDealers);

router.patch("/dealers/:id", sPatchDealers, dealersController.patchDealers);

router.delete("/dealers/:id", mDeleteDealers, dealersController.deleteDealers);
module.exports = router;
