const { default: knex } = require("knex");
const db = require("../../db");
const { siteUrl } = require("../../shared/config");
// const { BadRequestErr, NotFoundErr } = require("../../shared/errors");

const getProducts = async (req, res, next) => {
  try {
    const products = await db("products").select("*");
    return res.status(200).json({
      message: "success",
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({
      status: 503,
      errMessage: "Server error",
    });
  }
};

const newProducts = async (req, res, next) => {
  try {
    const data = await db("products").where("created_at").select("*");

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(503).json({
      status: 503,
      errMessage: "Server error",
    });
  }
};

const showProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await db("products").where({ id }).select("*").first();

    if (!product) {
      return res.status(404).json({
        error: `No product with id ${id}`,
      });
    }

    return res.status(200).json({
      message: "success",
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({
      status: 503,
      errMessage: "Server error",
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
        error: `No product with id ${id}`,
      });
    }

    if (req.files) {
      const files = req.files.map((file) => ({
        filename: file.filename,
        image_url: `${siteUrl}/${file.filename}`,
      }));

      let images = await db("images")
        .insert(files)
        .returning(["id", "image_url", "filename"]);

      const updated = await db("products")
        .where({ id })
        .update({ ...changes, images: images })
        .returning(["*"]);

      return res.status(200).json({
        updated: updated[0],
      });
    } else {
      const updated = await db("products")
        .where({ id })
        .update({ ...changes })
        .returning(["*"]);

      return res.status(200).json({
        updated: updated[0],
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(503).json({
      status: 503,
      errMessage: "Server error",
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
        data: products[0],
      });
    }
  } catch (error) {
    res.status(400).json({ message: `Xatolik! ${error}` });
  }
};
const deleteProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await db("products").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `No product with id ${id}`,
      });
    }

    const deletedProduct = await db("products")
      .where({ id })
      .del()
      .returning("*");

    return res.status(200).json({
      deleted: deletedProduct[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({
      status: 503,
      errMessage: "Server error",
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
