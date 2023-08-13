const express = require("express");
const genValidator = require("../shared/validator");
const { isLoggedIn, hasRole } = require("../shared/auth");
const {
  postNewsSchema,
  patchNewsSchema,
  getNewsSchema,
} = require("../controllers/news/schemas/index");
const newsController = require("../controllers/news");
const upload = require("../uploads");

const router = express.Router();

const sPostNews = [
  upload.single("image"),
  isLoggedIn,
  genValidator(postNewsSchema),
];
// const sGetNews = [isLoggedIn];
// const mShowNews = [isLoggedIn];

const sGetNews = [
  // isLoggedIn,
  //
  genValidator(getNewsSchema),
];

const sPatchNews = [
  upload.single("image"),
  isLoggedIn,
  genValidator(patchNewsSchema),
];

const mDeleteNews = [isLoggedIn];

router.post("/news", sPostNews, newsController.postNews);

router.get("/news", newsController.getNews);

router.get("/news/:id", sGetNews, newsController.showNews);

router.patch("/news/:id", sPatchNews, newsController.patchNews);

router.delete("/news/:id", mDeleteNews, newsController.deleteNews);

router.get("/", newsController.getRun);
router.get("/dev", newsController.getMain);

module.exports = router;
