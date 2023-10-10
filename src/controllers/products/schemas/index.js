const Joi = require("joi");

exports.postProductsSchema = Joi.object({
  uz_product_name: Joi.string().min(2),
  ru_product_name: Joi.string().min(2),
  en_product_name: Joi.string().min(2),

  uz_desc: Joi.string(),
  ru_desc: Joi.string(),
  en_desc: Joi.string(),

  category_id: Joi.number().integer(),
});

exports.patchProductsSchema = Joi.object({
  uz_product_name: Joi.string(),
  ru_product_name: Joi.string(),
  en_product_name: Joi.string(),

  uz_desc: Joi.string(),
  ru_desc: Joi.string(),
  en_desc: Joi.string(),

  category_id: Joi.number().integer(),
});
