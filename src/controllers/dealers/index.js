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
    const dealers = await db("dealers").select("*").orderBy("id", "asc");

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
      .select("*")
      .where({ "dealers.id": id })

      .first();
    if (!dealers) {
      return res.status(404).json({
        error: `${id} - не найдено`,
      });
    }

    return res.status(200).json({
      message: "успешно",
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
        error: `${id} не найдено`,
      });
    }

    const updated = await db("dealers")
      .where({ id })
      .update({ ...changes })
      .returning(["*"]);
    res.status(200).json({
      updated: updated[0],
    });
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

      location,

      phone_number,
      addition_number,
    } = req.body;

    const dealers = await db("dealers")
      .insert({
        id,
        title_uz,
        title_ru,
        title_en,

        desc_uz,
        desc_ru,
        desc_en,

        location,

        phone_number,
        addition_number,
      })
      .returning(["*"]);

    res.status(200).json({
      data: [...dealers],
    });
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
        error: `${id} не найдено`,
      });
    }

    const del = await db("dealers").where({ id }).returning(["*"]).del();

    res.status(200).json({
      message: "Удалено успешно",
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
