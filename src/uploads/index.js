const multer = require("multer");
const crypto = require("crypto");
let unique = crypto.randomUUID();
// console.log(unique);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public"); // Fayllarni saqlash joyi
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix); // Fayl nomini generatsiya qilish
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
