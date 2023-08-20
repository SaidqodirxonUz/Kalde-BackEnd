const Joi = require("joi");

exports.postProductsSchema = Joi.object({
  uz_product_name: Joi.string().min(2),
  ru_product_name: Joi.string().min(2),
  en_product_name: Joi.string().min(2),

  uz_desc: Joi.string().min(5),
  ru_desc: Joi.string().min(5),
  en_desc: Joi.string().min(5),
  category_id: Joi.number().integer(),

  price: Joi.number().integer().required(),
  barcode: Joi.number().integer().required(),

  diametr: Joi.string(),
  ichki_diametr: Joi.string(),
  ichki_uzunlik: Joi.string(),
  tashqi_uzunlik: Joi.string(),
  razmer: Joi.string(),
  soni: Joi.string(),
});

exports.patchProductsSchema = Joi.object({
  uz_product_name: Joi.string,
  ru_product_name: Joi.string,
  en_product_name: Joi.string,
  uz_desc: Joi.string,
  ru_desc: Joi.string,
  en_desc: Joi.string,

  category_id: Joi.number().integer(),

  price: Joi.string().integer(),
  barcode: Joi.string().integer(),

  diametr: Joi.string(),
  ichki_diametr: Joi.string(),
  ichki_uzunlik: Joi.string(),
  tashqi_uzunlik: Joi.string(),
  razmer: Joi.string(),
  soni: Joi.string(),
});
