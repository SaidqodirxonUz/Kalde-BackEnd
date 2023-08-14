const { default: knex } = require("knex");
const db = require("../../db");
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
      errMessage: `Server error`,
    });
  }
};

const newProducts = async (req, res, next) => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const data = await db("products")
      .where("created_at", ">", oneWeekAgo)
      .select("*");

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
  }
};

const showProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await db("products").where({ id }).select("*").first();

    if (!product) {
      return res.status(400).json({
        error: `${id} - no product with id`,
      });
    }

    return res.status(201).json({
      message: "success",
      data: { ...product },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
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
        error: `No product with ${id}-id`,
      });
    }

    const isAdm = req.user?.role || null;

    if (req.files) {
      const files = req.files.map((file) => ({
        filename: file.filename,
        image_url: `http://localhost:5000/${file.filename}`,
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
    return res.status(400).json({});
  }
};
const postProducts = async (req, res, next) => {
  try {
    const { error, value } = postProductsSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        error: error.details[0].message,
      });
    }

    const image = req?.files;

    if (!image || image.length === 0) {
      return res.status(400).json({
        message: "Error! No image uploaded.",
      });
    }

    const images = files.map((file) => ({
      filename: file.filename,
      image_url: `http://localhost:5000/${file.filename}`,
    }));

    const insertedImages = await db("images")
      .insert(images)
      .returning(["id", "image_url", "filename"]);

    const productData = {
      ...value,
      images: insertedImages,
    };

    const insertedProduct = await db("products")
      .insert(productData)
      .returning(["*"]);

    return res.status(200).json({
      data: insertedProduct[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await db("products").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `No product with ${id}-id`,
      });
    }

    const del = await db("products").where({ id }).returning(["*"]).del();

    return res.status(200).json({
      deleted: del,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
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
