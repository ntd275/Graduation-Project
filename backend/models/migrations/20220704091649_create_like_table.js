/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("like", (table) => {
        table.integer("postId", 10);
        table.integer("accountId", 10);
        table.datetime("createdTime").defaultTo(knex.fn.now());
        table.primary(["postId", "accountId"]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    knex.schema.dropTable("like");
};
