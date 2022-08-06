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