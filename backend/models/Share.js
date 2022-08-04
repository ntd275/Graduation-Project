const knex = require("./database");

exports.getShareByAccountId = (accountId) => {
    return knex("post").where("author", accountId).andWhere("isShare", true);
};

exports.getShareByPostId = (postId) => {
    return knex("post").where("sharePostId", postId).andWhere("isShare", true);
}

exports.createShare = (sharePostId, author, content) => {
    return knex("post").insert({
        sharePostId: sharePostId,
        author: author,
        content: content,
        isShare: true,
        createdTime: new Date(),
    });
};
