const Joi = require("joi");

exports.postProductsSchema = Joi.object({
  uz_product_name: Joi.string().min(2),
  ru_product_name: Joi.string().min(2),
  en_product_name: Joi.string().min(2),

  uz_desc: Joi.string().min(2),
  ru_desc: Joi.string().min(2),
  en_desc: Joi.string().min(2),
  category_id: Joi.number().integer(),

  price: Joi.number().integer().required(),
  barcode: Joi.number().integer().required(),

  diametr: Joi.number(),
  ichki_diametr: Joi.number(),
  ichki_uzunlik: Joi.number(),
  tashqi_uzunlik: Joi.number(),
  razmer: Joi.number(),
  soni: Joi.number(),
});

exports.patchProductsSchema = Joi.object({
  uz_product_name: Joi.string().min(2),
  ru_product_name: Joi.string().min(2),
  en_product_name: Joi.string().min(2),
  uz_desc: Joi.string().min(2),
  ru_desc: Joi.string().min(2),
  en_desc: Joi.string().min(2),

  category_id: Joi.number().integer(),

  price: Joi.number().integer(),
  barcode: Joi.number().integer(),

  diametr: Joi.number(),
  ichki_diametr: Joi.number(),
  ichki_uzunlik: Joi.number(),
  tashqi_uzunlik: Joi.number(),
  razmer: Joi.number(),
  soni: Joi.number(),
});
