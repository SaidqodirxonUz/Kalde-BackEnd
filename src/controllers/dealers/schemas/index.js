const Joi = require("joi");

patchDealersSchema = Joi.object({
  title_uz: Joi.string(),
  title_ru: Joi.string(),
  title_en: Joi.string(),

  desc_uz: Joi.string(),
  desc_ru: Joi.string(),
  desc_en: Joi.string(),

  location: Joi.string(),

  phone_number: Joi.string(),
  addition_number: Joi.string(),
  //
});

postDealersSchema = Joi.object({
  title_uz: Joi.string().required(),
  title_ru: Joi.string().required(),
  title_en: Joi.string(),

  desc_uz: Joi.string().required(),
  desc_ru: Joi.string().required(),
  desc_en: Joi.string(),

  location: Joi.string().required(),

  phone_number: Joi.string().required(),
  addition_number: Joi.string(),
  //
});

getDealersSchema = Joi.object({
  title_uz: Joi.string(),
  title_ru: Joi.string(),
  title_en: Joi.string(),

  desc_uz: Joi.string(),
  desc_ru: Joi.string(),
  desc_en: Joi.string(),

  location: Joi.string(),

  phone_number: Joi.string(),
  addition_number: Joi.string(),
});
module.exports = {
  patchDealersSchema,
  postDealersSchema,
  getDealersSchema,
};

// dealers
