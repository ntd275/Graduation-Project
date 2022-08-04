const knex = require("./database");

exports.getConversationList = (accountId) => {
    return knex("conversation")
        .where("account1", accountId)
        .orWhere("account2", accountId);
};

exports.getConversation = (account1, account2) => {
    return knex("conversation")
        .where((builder) =>
            builder.where("account1", account1).andWhere("account2", account2)
        )
        .orWhere((builder) =>
            builder.where("account1", account2).andWhere("account2", account1)
        ).first();
};

exports.createConversation = (account1, account2) => {
    return knex("conversation").insert({
        account1: account1,
        account2: account2,
    });
};

exports.deleteConversation = async (conversationId, accountId) => {
    const conversation = await knex("conversation")
        .where("conversationId", conversationId)
        .first();
    if (!conversation) {
        return;
    }
    if (conversation.account1 === accountId) {
        return knex("conversation")
            .where("conversationId", conversationId)
            .update({
                account1DeleteTime: new Date(),
            });
    }
    return knex("conversation").where("conversationId", conversationId).update({
        account2DeleteTime: new Date(),
    });
};
