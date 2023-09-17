const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const config = require("./src/shared/config");

const adminRoutes = require("./src/routes/forAdmin");
const categoryRoutes = require("./src/routes/categories");
const productRoutes = require("./src/routes/products");
const dealersRoutes = require("./src/routes/dealers");
const newsRoutes = require("./src/routes/news");
const sendMessageRoutes = require("./src/routes/sendmessage");

const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

console.log(path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(adminRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(dealersRoutes);
app.use(sendMessageRoutes);

app.use(newsRoutes);

app.listen(config.port, () => {
  console.log(`Server ${config.port} - portda ishlayapti`);
});
