const Joi = require("joi");

exports.postCategoriesSchema = Joi.object({
  uz_category_name: Joi.string().min(2),
  ru_category_name: Joi.string().min(2),
});
exports.patchCategoriesSchema = Joi.object({
  uz_category_name: Joi.string(),
  ru_category_name: Joi.string(),
});
