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

    table.text("uz_desc").notNullable();
    table.text("ru_desc").notNullable();
    table.text("en_desc").notNullable();

    table.string("price").notNullable();
    table.string("barcode").notNullable().unique();

    table.string("diametr");
    table.string("ichki_diametr");
    table.string("ichki_uzunlik");
    table.string("tashqi_uzunlik");
    table.string("razmer");
    table.string("soni");

    table
      .integer("category_id")
      .unsigned()
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");

    table.integer("img_id").references("id").inTable("images").unique();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("products");
};
