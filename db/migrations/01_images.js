/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("images", (table) => {
    table.increments("id").primary();

    table.string("filename").notNullable().unique();
    table.string("image_url").notNullable().unique();

    table
      .timestamp("created_at", { useTz: false })
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("images");
};
