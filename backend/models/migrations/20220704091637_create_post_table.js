/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("post", (table) => {
        table
            .specificType("postId", "int(10) AUTO_INCREMENT primary key")
            .notNullable();
        table.text("content");
        table.text("files").defaultTo("[]");
        table.boolean("isShare").defaultTo(false);
        table.integer("sharePostId", 10);
        table.integer("author", 10);
        table.datetime("createdTime").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    knex.schema.dropTable("post");
};
