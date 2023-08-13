/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.increments("id").primary();

    table.string("uz_product_name", 250).notNullable().unique();
    table.string("ru_product_name", 250).notNullable().unique();

    table.text("uz_description").notNullable();
    table.text("ru_description").notNullable();

    table
      .integer("category_id")
      .unsigned()
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");

    table.integer("img_id").references("id").inTable("images").unique();

    // table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("products");
};
