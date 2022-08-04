const knex = require("./database");

exports.getLikeByPostId = (postId) => {
    return knex("like").where("postId", postId);
};

exports.createLike = (postId, accountId) => {
    return knex("like").insert({
        postId: postId,
        accountId: accountId,
    });
}

exports.deleteLike = (postId,accountId) => {
    return knex('like').where("postId", postId).andWhere("accountId", accountId).del();
}