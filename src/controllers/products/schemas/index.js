const Joi = require("joi");

exports.postProductsSchema = Joi.object({
  uz_product_name: Joi.string().min(2),
  ru_product_name: Joi.string().min(2),

  uz_desc: Joi.string().min(2),
  ru_desc: Joi.string().min(2),
  category_id: Joi.number().integer(),
});

exports.patchProductsSchema = Joi.object({
  uz_product_name: Joi.string().min(2),
  ru_product_name: Joi.string().min(2),

  uz_desc: Joi.string().min(2),
  ru_desc: Joi.string().min(2),

  category_id: Joi.number().integer(),
});
