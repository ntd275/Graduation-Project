/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("account", (table) => {
        table
            .specificType("accountId", "int(10) AUTO_INCREMENT primary key")
            .notNullable();
        table.string("email", 255).notNullable();
        table.string("password", 255).notNullable();
        table.string("name", 255).notNullable();
        table.string("avatar", 255);
        table.string("coverImage", 255);
        table.string("phoneNumber", 20);
        table.boolean("gender");
        table.date("dateOfBirth");
        table.string("address", 255);
        table.unique("email");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropTable("account");
};
