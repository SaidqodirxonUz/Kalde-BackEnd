const { default: knex } = require("knex");
const db = require("../../db");
const { siteUrl } = require("../../shared/config");
// const { BadRequestErr, NotFoundErr } = require("../../shared/errors");
const getProducts = async (req, res, next) => {
  try {
    const { categoryId } = req.query; // Kategoriya ID larini olish
    let query = db("products")
      .leftJoin("images", "images.id", "products.img_id")
      .select("products.*", "images.image_url");

    if (categoryId) {
      const categoryIdArray = categoryId.split(","); // Kategoriya ID larini vergul bilan ajratib olamiz
      query = query.whereIn("products.category_id", categoryIdArray); // Kategoriya ID lari asosida filterlash
    }

    const products = await query;

    return res.status(200).json({
      data: products,
    });
  } catch (error) {
    return res.status(400).json({
      errMessage: "Произошла ошибка",
    });
  }
};

const newProducts = async (req, res, next) => {
  try {
    const data = await db("products").where("created_at").select("*");

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: 400,
      errMessage: "Произошла ошибка",
    });
  }
};

const showProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await db("products").where({ id }).select("*").first();

    if (!product) {
      return res.status(404).json({
        error: `${id} не найдено`,
      });
    }

    console.log(product.img_id);

    if (product.img_id) {
      let id = product.img_id;

      imgUrl = await db("images").where({ id }).select("image_url");
      console.log(imgUrl);
      return res.status(201).json({
        message: "success",
        data: { ...product, ...imgUrl[0] },
      });
    }

    // return res.status(200).json({
    //   message: "success",
    //   data: product,
    // });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: 400,
      errMessage: "Произошла ошибка",
    });
  }
};

const patchProducts = async (req, res, next) => {
  try {
    const { ...changes } = req.body;
    const { id } = req.params;
    const reqfile = req?.files;

    const existing = await db("products").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} не найдено`,
      });
    }

    let oldImgId = null;
    oldImgId = existing.img_id;

    if (req.file?.filename) {
      let image = null;
      let filename = req.file?.filename;

      const files = {
        filename,
        image_url: `${siteUrl}/${filename}`,
      };

      image = await db("images")
        .insert(files)
        .returning(["id", "image_url", "filename"]);

      console.log(image[0].id, "if dagi holat");

      const updated = await db("products")
        .where({ id })
        .update({ ...changes, img_id: image[0].id })
        .returning(["*"]);

      return res.status(200).json({
        updated: updated[0],
      });
    } else if (existing.img_id !== "" || existing.img_id !== nul) {
      const updated = await db("products")
        .where({ id })
        .update({ ...changes, img_id: existing.img_id })
        .returning(["*"]);

      console.log(existing.img_id, "else if dagi holat");

      return res.status(200).json({
        updated: updated[0],
      });
    } else {
      const updated = await db("products")
        .where({ id })
        .update({ ...changes, img_id: null })
        .returning(["*"]);

      return res.status(200).json({
        updated: updated,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: 400,
      error,
    });
  }
};

const postProducts = async (req, res, next) => {
  try {
    const data = req.body;
    const files = req?.files;

    if (files) {
      const images = await db("images")
        .insert(
          files.map((file) => ({
            filename: file.filename,
            image_url: `${siteUrl}/${file.filename}`,
          }))
        )
        .returning(["id", "image_url", "filename"]);

      const imageId = images[0].id;

      const products = await db("products")
        .insert({
          ...data,
          img_id: imageId,
        })
        .returning(["*"]);

      return res.status(200).json({
        message: "Добавлено успешно",
        data: products[0],
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: `Ошибка! картинка должна прийти ${error}` });
  }
};

const deleteProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await db("products").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} не найдено`,
      });
    }

    const deletedProduct = await db("products")
      .where({ id })
      .del()
      .returning("*");

    return res.status(200).json({
      message: "Удалено успешно",
      deleted: deletedProduct[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: 400,
      errMessage: "Произошла ошибка",
    });
  }
};

module.exports = {
  getProducts,
  postProducts,
  showProducts,
  newProducts,
  patchProducts,
  deleteProducts,
};
