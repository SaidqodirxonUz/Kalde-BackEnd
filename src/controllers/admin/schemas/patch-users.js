const Joi = require("joi");

exports.patchAdminSchema = Joi.object({
  full_name: Joi.string(),
  phone_number: Joi.string(),
  password: Joi.string().min(8),
});
