const { default: knex } = require("knex");
const db = require("../../db");
const { BadRequestErr, NotFoundErr } = require("../../shared/errors");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {knex} db
 */
const getCategories = async (req, res, next) => {
  // console.log(db("categories"));
  try {
    const Categories = await db("categories")
      .leftJoin("images", "images.id", "categories.img_id")
      .select(
        "categories.id",
        "categories.uz_category_name",
        "categories.ru_category_name",

        "images.image_url"
      )
      .groupBy("categories.id", "images.id");
    console.log(Categories);
    for (let i = 0; i < Categories.length; i++) {
      const id = Categories[i].id;
      const product = await db("products")
        .where({ category_id: id })
        .select("*");
      console.log(product, id);
      Categories[i].totalProducts = product.length;
      console.log(Categories);
    }
    return res.status(200).json({
      message: "success",
      data: [...Categories],
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestErr("Xatolik yuz berdi");
    // res.status(503).json({
    //   status: 503,
    //   errMessage: `Serverda xato ${error}`,
    // });
  }
};
const showCategories = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await db("categories")
      .where({ id })
      .select(
        "id",
        "uz_category_name",
        "ru_category_name",

        "img_id"
      )
      .first();
    if (!category) {
      return res.status(400).json({
        error: `${id} - idli category yo'q`,
      });
    }
    // console.log(category);
    if (category.img_id) {
      let id = category.img_id;
      console.log(category.img_id);
      imgUrl = await db("images").where({ id }).select("image_url");
      console.log(imgUrl);
      return res.status(201).json({
        message: "success",
        data: { ...category, ...imgUrl[0] },
      });
    }
    return res.status(201).json({
      message: "success",
      data: { ...category },
    });
  } catch (error) {
    // throw new BadRequestErr("Xatolik yuz berdi", error);
    next(error);
  }
};
const patchCategories = async (req, res, next) => {
  try {
    const { ...changes } = req.body;
    const { id } = req.params;
    const existing = await db("categories").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idli category yo'q`,
      });
    }
    if (req.file?.filename) {
      let image = null;
      let filename = req.file?.filename;
      if (filename) {
        image = await db
          .insert({
            filename,
            image_url: `http://localhost:5000/${filename}`,
          })
          .into("images")
          .returning(["id", "image_url", "filename"]);
      }
      const updated = await db("categories")
        .where({ id })
        .update({ ...changes, img_id: { image }.image[0]?.id || image })
        .returning(["id", "uz_category_name", "ru_category_name", "img_id"]);

      res.status(200).json({
        updated: [updated[0], ...image],
      });
    } else {
      const updated = await db("categories")
        .where({ id })
        .update({ ...changes, img_id: null })
        .returning(["id", "uz_category_name", "ru_category_name", "img_id"]);

      res.status(200).json({
        updated: updated[0],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: `Xatolik! ${error}`,
    });
    // throw new NotFoundErr("Nothing founded!");
  }
};
const postCategories = async (req, res, next) => {
  try {
    const { uz_category_name, ru_category_name } = req.body;
    if (req.file?.filename) {
      const filename = req.file?.filename;
      console.log(filename);
      let image = null;
      if (filename) {
        image = await db("images")
          .insert({
            filename,
            image_url: `http://localhost:5000/${filename}`,
          })
          .returning(["id", "image_url", "filename"]);
      }
      const category = await db("categories")
        .insert({
          uz_category_name,
          ru_category_name,

          img_id: { image }.image[0].id,
        })
        .returning(["*"]);

      res.status(200).json({
        data: category[0],
      });
    } else {
      const category = await db("categories")
        .insert({
          uz_category_name,
          ru_category_name,

          img_id: null,
        })
        .returning(["*"]);
      res.status(200).json({
        data: category[0],
      });
    }
  } catch (error) {
    console.log(error);

    res.status(400).json({
      message: `Xatolik! ${error}`,
    });
    // throw new BadRequestErr("Something went wrong!", error);
    // res.send(error);
  }
};
const deleteCategories = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await db("categories").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idli category yo'q`,
      });
    }

    const del = await db("categories").where({ id }).returning(["*"]).del();

    res.status(200).json({
      deleted: del,
    });
  } catch (error) {
    console.log(error);
    // throw new BadRequestErr("Something went wrong!", error);

    res.status(400).json({
      message: `Xatolik! ${error}`,
    });
  }
};
module.exports = {
  getCategories,
  postCategories,
  showCategories,
  patchCategories,
  deleteCategories,
};
