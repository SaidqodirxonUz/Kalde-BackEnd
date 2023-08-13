const dotenv = require("dotenv");
dotenv.config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  db: {
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

module.exports = config;
