/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("dealers", (table) => {
    table.increments("id").primary();
    table.string("title_uz", 300).notNullable();
    table.string("title_ru", 300).notNullable();
    table.text("desc_uz").notNullable();
    table.text("desc_ru").notNullable();
    table.string("adress", 300).notNullable();
    table.string("location", 300).notNullable();
    table.string("email", 300).notNullable();
    table.string("orientation", 300).notNullable();
    table.string("work_at", 300).notNullable();
    table.string("phone_number", 30).notNullable();
    table.string("addition_number", 30);

    table
      .integer("dealers_img_id")
      .references("id")
      .inTable("images")
      .onDelete("SET NULL");
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
