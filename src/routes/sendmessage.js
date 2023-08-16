const express = require("express");
const { FormSendMessage } = require("../controllers/sendMessage");

const router = express.Router();

router.post("/send", FormSendMessage);

module.exports = router;
