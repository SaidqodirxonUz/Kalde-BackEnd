const Joi = require("joi");

exports.loginAdminSchema = Joi.object({
  full_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  password: Joi.string().required().min(8),
});
