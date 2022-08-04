/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("comment", (table) => {
        table
            .specificType("commentId", "int(10) AUTO_INCREMENT primary key")
            .notNullable();
        table.integer("accountId", 10).notNullable();
        table.integer("postId", 10).notNullable();
        table.text("comment").notNullable();
        table.datetime("createdTime").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    knex.schema.dropTable("comment");
};
