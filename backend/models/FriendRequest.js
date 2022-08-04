const knex = require("./database");

exports.getFriendRequest = (accountId) => {
    return knex("friendRequest")
        .where("receiver", accountId).join("account", "accountId" , "=" , "sender")
};

exports.getSendFriendRequest = (accountId) => {
    return knex("friendRequest")
        .where("sender", accountId)
};

exports.deleteFriendRequest = (sender, receiver) => {
    return knex("friendRequest")
        .where("sender", sender).andWhere("receiver", receiver).del();
};

exports.createFriendRequest = (sender, receiver) => {
    return knex("friendRequest").insert({
        sender: sender,
        receiver: receiver,
    });
};
