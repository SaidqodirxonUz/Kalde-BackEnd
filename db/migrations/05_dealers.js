/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("dealers", (table) => {
    table.increments("id").primary();
    table.string("title_uz", 300).notNullable();
    table.string("title_ru", 300).notNullable();
    table.string("title_en", 300).notNullable();
    table.text("desc_uz").notNullable();
    table.text("desc_ru").notNullable();
    table.text("desc_en").notNullable();

    table.text("location").notNullable();

    table.string("phone_number", 30).notNullable();
    table.string("addition_number", 30);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("dealers");
};

// -phone_numbers #min2
