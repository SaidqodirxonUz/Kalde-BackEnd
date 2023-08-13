/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("news", (table) => {
    table.increments("id").primary();
    table.string("title_uz", 300).notNullable();
    table.string("title_ru", 300).notNullable();

    //
    //
    table.text("desc_uz").notNullable();
    table.text("desc_ru").notNullable();

    //
    table
      .integer("news_img_id")
      .references("id")
      .inTable("images")
      .onDelete("SET NULL");

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("news");
};
