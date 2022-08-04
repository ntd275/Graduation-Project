/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("message", (table) => {
        table
            .specificType("messageId", "int(10) AUTO_INCREMENT primary key")
            .notNullable();
        table.integer("conversationId", 10).notNullable();
        table.integer("sender", 10).notNullable();
        table.datetime("createdTime").defaultTo(knex.fn.now());
        table.text("message").notNullable();
        table.boolean("isRecall").notNullable().defaultTo(false);
        table.boolean("isCall").notNullable().defaultTo(false);
        table.integer("callDuration");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    knex.schema.dropTable("message");
};
