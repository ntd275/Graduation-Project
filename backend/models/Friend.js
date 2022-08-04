const knex = require("./database");

exports.getFriendList = (accountId) => {
    return knex("friend")
        .where("account1", accountId)
        .orWhere("account2", accountId);
};

exports.getSuggestFriendList = async (friendList) => {
    return knex("friend")
    .whereIn("account1", friendList)
    .orWhereIn("account2", friendList);
}

exports.deleteFriend = (account1, account2) => {
    return knex("friend")
        .where((builder) =>
            builder.where("account1", account1).andWhere("account2", account2)
        )
        .orWhere((builder) =>
            builder.where("account1", account2).andWhere("account2", account1)
        ).del();
};

exports.createFriend = (account1, account2) => {
    return knex("friend").insert({
        account1: account1,
        account2: account2,
    });
};
