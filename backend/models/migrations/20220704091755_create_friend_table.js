/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("friend", (table) => {
        table.integer("account1", 10).notNullable();
        table.integer("account2", 10).notNullable();
        table.datetime("createdTime").defaultTo(knex.fn.now());
        table.primary(["account1", "account2"]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    knex.schema.dropTable("friend");
};
