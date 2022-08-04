const knex = require("./database");

exports.getCommentByPostId = (postId) => {
    return knex("comment").where("postId", postId).join("account", "comment.accountId", "=", "account.accountId");
};

exports.createComment = (postId, accountId, comment) => {
    return knex("comment").insert({
        postId: postId,
        accountId: accountId,
        comment: comment,
        createdTime: new Date(),
    });
};

exports.deleteComment = (commentId) => {
    return knex("comment")
        .where("commentId", commentId)
        .del();
};

exports.editComment = (commentId, comment) => {
    return knex("comment")
        .where("commentId", commentId)
        .update({ comment: comment });
};
