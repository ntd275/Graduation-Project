/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("friendRequest", (table) => {
        table.integer("sender", 10).notNullable();
        table.integer("receiver", 10).notNullable();
        table.datetime("createdTime").defaultTo(knex.fn.now());
        table.primary(["sender", "receiver"]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    knex.schema.dropTable("friendRequest");
};
