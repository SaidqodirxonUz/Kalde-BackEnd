const { default: knex } = require("knex");
const db = require("../../db/index");
const { siteUrl } = require("../../shared/config");
// const { BadRequestErr, NotFoundErr } = require("../../shared/errors");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {knex} db
 */
const getDealers = async (req, res, next) => {
  try {
    // const a = await db.select().from("dealers");
    const dealers = await db("dealers")
      .leftJoin("images", "images.id", "=", "dealers.dealers_img_id")
      .select(
        "dealers.id",
        //
        "dealers.title_uz",
        "dealers.title_ru",
        "dealers.title_en",

        "dealers.desc_uz",
        "dealers.desc_ru",
        "dealers.desc_en",

        "dealers.adress",
        "dealers.location",
        "dealers.email",
        "dealers.orientation",
        "dealers.work_at",
        "dealers.phone_number",
        "addition_number",

        "images.image_url"
      )
      .groupBy("dealers.id", "images.id");

    console.log(dealers);
    res.json(dealers);
  } catch (error) {
    console.log("err shu yerdan");
    throw error;
  }
};
const showDealers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dealers = await db("dealers")
      // .leftJoin("images", "images.id", "dealers.img_id")
      .select(
        "id",
        "title_uz",
        "title_ru",
        "title_en",
        "desc_uz",
        "desc_ru",
        "desc_en",
        "adress",
        "location",
        "email",
        "orientation",
        "work_at",
        "phone_number",
        "addition_number",
        "dealers_img_id"
      )
      .where({ "dealers.id": id })
      // .groupBy("dealers.id", "images.id")
      .first();
    if (!dealers) {
      return res.status(404).json({
        error: `${id} - Topilmadi`,
      });
    }

    console.log(dealers.dealers_img_id);

    if (dealers.dealers_img_id) {
      let id = dealers.dealers_img_id;

      let imgUrl = await db("images").where({ id }).select("image_url");
      console.log(imgUrl);

      return res.status(200).json({
        message: "muvaffaqiyat",
        data: { ...dealers, ...imgUrl[0] },
      });
    }

    return res.status(200).json({
      message: "muvaffaqiyat",
      data: [dealers],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error,
    });
  }
};

const patchDealers = async (req, res, next) => {
  try {
    const { ...changes } = req.body;
    const { id } = req.params;
    const existing = await db("dealers").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} - Not found`,
      });
    }

    let oldImgId = "";
    oldImgId = existing.img_id;
    console.log(oldImgId);

    if (req.file?.filename) {
      let image = null;
      let filename = req.file?.filename;
      if (filename) {
        image = await db
          .insert({
            filename,
            image_url: `${siteUrl}/${filename}`,
          })
          .into("images")
          .returning(["id", "image_url", "filename"]);
      }
      const updated = await db("dealers")
        .where({ id })
        .update({ ...changes, dealers_img_id: { image }.image[0]?.id || image })
        .returning([
          "id",
          //
          "title_uz",
          "title_ru",
          "title_en",
          "desc_uz",
          "desc_ru",
          "desc_en",
          "adress",
          "location",
          "email",
          "orientation",
          "work_at",
          "phone_number",
          "addition_number",

          "dealers_img_id",
          //
        ]);
      res.status(200).json({
        updated: [updated[0], ...image],
      });
    } else if (oldImgId !== "") {
      const updated = await db("dealers")
        .where({ id })
        .update({ ...changes, dealers_img_id: oldImgId })
        .returning([
          "id",
          //
          "title_uz",
          "title_ru",
          "title_en",
          "desc_uz",
          "desc_ru",
          "desc_en",
          "adress",
          "location",
          "email",
          "orientation",
          "work_at",
          "phone_number",
          "addition_number",

          "dealers_img_id",
        ]);
      res.status(200).json({
        updated: updated[0],
      });
    } else {
      const updated = await db("dealers")
        .where({ id })
        .update({ ...changes, dealers_img_id: null })
        .returning([
          "id",
          //
          "title_uz",
          "title_ru",
          "title_en",
          "desc_uz",
          "desc_ru",
          "desc_en",
          "adress",
          "location",
          "email",
          "orientation",
          "work_at",
          "phone_number",
          "addition_number",

          "dealers_img_id",
        ]);
      res.status(200).json({
        updated: updated[0],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error,
    });
  }
};
const postDealers = async (req, res, next) => {
  try {
    const {
      id,
      //
      title_uz,
      title_ru,
      title_en,

      desc_uz,
      desc_ru,
      desc_en,

      adress,
      location,
      email,
      orientation,
      work_at,
      phone_number,
      addition_number,

      dealers_img_id,
    } = req.body;
    // console.log(dealers);
    if (req.file?.filename) {
      //  const { filename } = req.file;
      let filename = req.file?.filename;

      const image = await db("images")
        .insert({
          filename,
          image_url: `${siteUrl}/${filename}`,
        })
        .returning(["id", "image_url", "filename"]);
      const dealers = await db("dealers")
        .insert({
          id,
          title_uz,
          title_ru,
          title_en,

          desc_uz,
          desc_ru,
          desc_en,

          adress,
          location,
          email,
          orientation,
          work_at,
          phone_number,
          addition_number,

          dealers_img_id: { image }.image[0].id,
        })
        .returning(["*"]);

      res.status(200).json({
        data: [...dealers, image[0]],
      });
    } else {
      const dealers = await db("dealers")
        .insert({
          id,
          //
          title_uz,
          title_ru,
          title_en,

          desc_uz,
          desc_ru,
          desc_en,

          adress,
          location,
          email,
          orientation,
          work_at,
          phone_number,
          addition_number,

          //   dealers_img_id: { image }.image[0].id,
          dealers_img_id: null,
        })
        .returning(["*"]);

      res.status(200).json({
        data: [...dealers],
      });
    }
  } catch (error) {
    console.log(error);
    // throw new NotFoundErr("something went wrong");
    res.send(error);
  }
};
const deleteDealers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await db("dealers").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} - Not found`,
      });
    }

    const del = await db("dealers").where({ id }).returning(["*"]).del();

    res.status(200).json({
      deleted: del,
    });
  } catch (error) {
    res.status(404).json({
      error,
    });
  }
};
module.exports = {
  getDealers,
  postDealers,
  showDealers,
  patchDealers,
  deleteDealers,
};

// phone_number
