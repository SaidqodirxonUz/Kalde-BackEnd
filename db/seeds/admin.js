const { hashSync } = require("bcryptjs");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("admin").del();
  await knex("admin").insert([
    {
      // id: 1,
      full_name: "Saidqodirxon",
      phone_number: "+998904024707",
      password: hashSync("realcoderuz", 10),
    },
  ]);
};
