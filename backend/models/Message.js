const knex = require("./database");

exports.getMessageList = (conversationId) => {
    return knex("message")
        .where("conversationId", conversationId);
};

exports.createMessage = (conversationId, sender, message) => {
    return knex("message").insert({
        conversationId: conversationId,
        sender: sender,
        message: message,
    });
};

exports.createMessageCall = (conversationId, sender, callDuration) => {
    return knex("message").insert({
        conversationId: conversationId,
        sender: sender,
        message: "",
        callDuration: callDuration,
    });
};

exports.recallMessage = (messageId) => {
    return knex("message").where("messageId", messageId).update({isRecall: true});
};
