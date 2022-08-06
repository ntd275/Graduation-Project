const knex = require("./database");

exports.getMessageList = (conversationId, time) => {
    return knex("message")
        .where("conversationId", conversationId).andWhere("createdTime", ">", time );
};

exports.getLastMessage = (conversationId, time) => {
    return knex("message")
        .where("conversationId", conversationId).andWhere("createdTime", ">", time ).orderBy("createdTime", "desc").first();
};

exports.createMessage = (conversationId, sender, message) => {
    return knex("message").insert({
        conversationId: conversationId,
        sender: sender,
        message: message,
        createdTime: new Date(),
    });
};

exports.createMessageCall = (conversationId, sender, callDuration) => {
    return knex("message").insert({
        conversationId: conversationId,
        sender: sender,
        message: "",
        callDuration: callDuration,
        createdTime: new Date(),
        isCall: true,
    });
};

exports.recallMessage = (messageId) => {
    return knex("message").where("messageId", messageId).update({isRecall: true});
};
