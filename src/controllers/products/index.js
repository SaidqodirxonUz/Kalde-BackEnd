const { default: knex } = require("knex");
const db = require("../../db");
const { siteUrl } = require("../../shared/config");
// const { BadRequestErr, NotFoundErr } = require("../../shared/errors");
const getProducts = async (req, res, next) => {
  try {
    const { categoryId } = req.query; // Kategoriya ID larini olish
    let query = db("products")
      .leftJoin("images as img1", "img1.id", "products.img_id")
      .leftJoin("images as img2", "img2.id", "products.img1_id")
      .select(
        "products.*",
        "img1.image_url as img_url",
        "img2.image_url as img_url1"
      );

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

// 99 878 221 0272

const showProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await db("products").where({ id }).select("*").first();

    if (!product) {
      return res.status(404).json({
        error: `${id} не найдено`,
      });
    }

    let img_id = product.img_id;
    let img1_id = product.img1_id;

    let imgUrls = await db("images")
      .whereIn("id", [img_id, img1_id])
      .select("id", "image_url");

    let imgUrlsMap = {};
    imgUrls.forEach((img) => {
      imgUrlsMap[img.id] = img.image_url;
    });

    return res.status(201).json({
      message: "success",
      data: {
        ...product,
        img_url: imgUrlsMap[img_id],
        img1_url: imgUrlsMap[img1_id],
      },
    });
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
    const reqFiles = req?.files;

    console.log(reqFiles);

    const existing = await db("products").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} не найдено`,
      });
    }

    let oldImgId = existing.img_id;
    let oldImg1Id = existing.img1_id;

    if (reqFiles && reqFiles.length > 0) {
      const filenames = reqFiles.map((file) => file.filename); // Extract filenames

      const images = filenames.map((filename) => ({
        filename,
        image_url: `${siteUrl}/${filename}`,
      }));

      // Insert the first image
      const [image1] = await db("images")
        .insert(images[0])
        .returning(["id", "image_url", "filename"]);

      // Insert the second image
      const [image2] = await db("images")
        .insert(images[1])
        .returning(["id", "image_url", "filename"]);

      // Update the product with both images
      const updated = await db("products")
        .where({ id })
        .update({ ...changes, img_id: image1.id, img1_id: image2.id })
        .returning(["*"]);

      return res.status(200).json({
        updated: updated[0],
      });
    } else {
      const updatedData = { ...changes };

      // If oldImgId and oldImg1Id are not null, include them in the update
      if (oldImgId !== null || oldImg1Id !== null) {
        updatedData.img_id = oldImgId;
        updatedData.img1_id = oldImg1Id;
      } else {
        // If they are null, set them to null explicitly
        updatedData.img_id = null;
        updatedData.img1_id = null;
      }

      const updated = await db("products")
        .where({ id })
        .update(updatedData)
        .returning(["*"]);

      return res.status(200).json({
        updated: updated[0],
      });
    }
  } catch (error) {
    console.error("Error in patchProducts:", error);
    return res.status(400).json({
      status: 400,
      error: "An error occurred while processing the request.",
    });
  }
};

const postProducts = async (req, res, next) => {
  try {
    console.log(req, "bu request");

    const data = req.body;
    const files = req?.files;

    if (files && files.length === 2) {
      const [image1, image2] = files;

      const imagesData = await db("images")
        .insert([
          {
            filename: image1.filename,
            image_url: `${siteUrl}/${image1.filename}`,
          },
          {
            filename: image2.filename,
            image_url: `${siteUrl}/${image2.filename}`,
          },
        ])
        .returning(["id", "image_url", "filename"]);

      const [image1Data, image2Data] = imagesData;

      const product = await db("products")
        .insert({
          ...data,
          img_id: image1Data.id,
          img1_id: image2Data.id,
        })
        .returning(["*"]);

      console.log(product, "insert boladigan products data");

      return res.status(200).json({
        message: "Добавлено успешно",
        data: product[0],
      });
    }
  } catch (error) {
    res.status(400).json({
      message: `Ошибка! Картинки должны быть предоставлены и их должно быть две ${error}`,
    });
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
