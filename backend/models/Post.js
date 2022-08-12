const knex = require("./database");

exports.getPost = (postId) => {
    return knex("post").where("postId", postId).join("account", "accountId", "=", "author").first();
};

exports.createPost = (post) => {
    return knex("post").insert({
        ...post,
    });
}

exports.editPost = (postId, data) => {
    return knex('post')
        .where('postId', postId)
        .update({
            ...data,
        })
}

exports.deletePost = (postId) => {
    return knex('post').where('postId', postId).del()
}

exports.search = (searchValue, page, perPage) => {
    return knex('post').whereRaw('LOWER(content) LIKE ?', '%'+searchValue.toLowerCase()+'%').join("account", "accountId", "=", "author").paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getPostByAccountId = (accountId) => {
    return knex('post').whereIn('author', accountId).join("account", "accountId", "=", "author").orderBy("createdTime", "desc");
}

exports.getLikeNotifications = (accountId) => {
    return knex('post').where('author', accountId).join("like", "like.postId", "=", "post.postId").join("account", "account.accountId", "=", "like.accountId");
}

exports.getCommentNotifications = (accountId) => {
    return knex('post').where('author', accountId).join("comment", "comment.postId", "=", "post.postId").join("account", "account.accountId", "=", "comment.accountId");
}

exports.getShareNotifications = (accountId) => {
    return knex('post').where('post.author', accountId).join("post as p", "p.sharePostId", "=", "post.postId").join("account", "account.accountId", "=", "p.author");
}