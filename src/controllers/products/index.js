const { default: knex } = require("knex");
const db = require("../../db");
// const { BadRequestErr, NotFoundErr } = require("../../shared/errors");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {knex} db
 */
const getProducts = async (req, res, next) => {
  // console.log(db("Products"));
  try {
    const Products = await db("products").select("*");
    // .leftJoin("product_images", "product_images.productId", "products.id")
    return res.status(200).json({
      message: "success",
      data: Products,
    });
  } catch (error) {
    console.log(error);
    // throw new BadRequestErr("Xatolik yuz berdi", error);
    res.status(503).json({
      status: 503,
      errMessage: `Serverda xato ${error}`,
    });
  }
};
const newProducts = async (req, res, next) => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const data = await db("products")
      .where("created_at", ">", oneWeekAgo)
      .select("*");

    res.json(data);
  } catch (error) {
    // console.log(error);
    throw new BadRequestErr("Xatolik yuz berdi");
    // res.status(503).json({
    //   status: 503,
    //   errMessage: `Serverda xato ${error}`,
    // });
  }
};
const showProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await db("products").where({ id }).select("*").first();

    if (!product) {
      return res.status(400).json({
        error: `${id} - idli product yo'q`,
      });
    }

    return res.status(201).json({
      message: "success",
      data: { ...product },
    });
  } catch (error) {
    throw new BadRequestErr("Xatolik yuz berdi");
  }
};
const patchProducts = async (req, res, next) => {
  try {
    const { ...changes } = req.body;
    const { id } = req.params;
    const reqfile = req?.files;

    console.log(reqfile, "request files");
    const existing = await db("products").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idli product yo'q`,
      });
    }

    console.log(req.user);
    console.log(req.user.role);
    const isAdm = req.user.role;
    console.log(changes);

    if (req.files) {
      const files = req.files.map((file) => ({
        filename: file.filename,
        image_url: `http://localhost:5000/${file.filename}`,
      }));
      console.log("mapped images", files);

      let images = await db("images")
        .insert(files)
        .returning(["id", "image_url", "filename"]);

      const updated = await db("products")
        .where({ id })
        .update({ ...changes, images: { ...images } })
        .returning(["*"]);

      return res.status(200).json({
        updated: [updated[0]],
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
    console.log(error);
    return res.status(400).json({
      message: `Xatolik! ${error}`,
    });
  }
};

const postProducts = async (req, res, next) => {
  try {
    const data = req.body;
    const files = req?.files;
    // const products = await db("products")
    //   .insert({
    //     ...data,
    //   })
    //   .returning(["*"]);

    if (req.files) {
      const images = req.files.map((file) => ({
        filename: file.filename,
        image_url: `http://localhost:5000/${file.filename}`,
      }));
      console.log("mapped images", images);
      // insert(images);
      let image = await db("images")
        .insert(images)
        .returning(["id", "image_url", "filename"]);
      // console.log(image, "inserted images");

      // urls = ["a", "v"];
      const products = await db("products")
        .insert({
          ...data,
          images: { ...image },
        })
        .returning(["*"]);
      return res.status(200).json({
        data: products[0],
      });
    }
  } catch (error) {
    console.log(error);

    res.status(400).json({
      message: `Xatolik! ${error}`,
    });
  }
};
const deleteProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await db("products").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idli product yo'q`,
      });
    }

    const del = await db("products").where({ id }).returning(["*"]).del();

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
  getProducts,
  postProducts,
  showProducts,
  newProducts,
  patchProducts,
  deleteProducts,
};
