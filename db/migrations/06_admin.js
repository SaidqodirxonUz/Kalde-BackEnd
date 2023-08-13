/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("admin", (table) => {
    table.increments("id").primary();
    table.string("full_name").notNullable();
    table.string("phone_number").notNullable().unique();
    table.string("password", 350);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("admin");
};
