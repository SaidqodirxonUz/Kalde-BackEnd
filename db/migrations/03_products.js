/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.increments("id").primary();

    table.string("uz_product_name", 250).notNullable();
    table.string("ru_product_name", 250).notNullable();
    table.string("en_product_name", 250).notNullable();

    table.text("uz_desc");
    table.text("ru_desc");
    table.text("en_desc");

    table
      .integer("category_id")
      .unsigned()
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");

    table.integer("img_id").references("id").inTable("images").unique();

    table.integer("img1_id").references("id").inTable("images").unique();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("products");
};
