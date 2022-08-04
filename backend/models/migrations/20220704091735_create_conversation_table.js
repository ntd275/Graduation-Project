/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("conversation", (table) => {
        table
            .specificType("conversationId", "int(10) AUTO_INCREMENT primary key")
            .notNullable();
        table.integer("account1", 10).notNullable();
        table.integer("account2", 10).notNullable();
        table.datetime("createdTime").defaultTo(knex.fn.now());
        table.datetime("account1DeleteTime").defaultTo(knex.fn.now());
        table.datetime("account2DeleteTime").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    knex.schema.dropTable("conversation");
};
