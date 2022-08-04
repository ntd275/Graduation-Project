const Conversation = require('../models/Conversation');

exports.createConversation = async (req, res) => {
    try {
        const isExist = await Conversation.getConversation(req.jwtDecoded.accountId, req.body.accountId);
        if (isExist) {
            return res.status(200).json({
                success: true,
                conversation: isExist,
            })
        }
        await Conversation.createConversation(req.jwtDecoded.accountId, req.body.accountId);
        const conversation = await Conversation.getConversation(req.jwtDecoded.accountId, req.body.accountId);
        return res.status(200).json({
            success: true,
            conversation: conversation,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            err,
        });
    }
}

exports.deleteConversation = async (req, res) => {
    try {
        await Conversation.deleteConversation(req.body.conversationId, req.jwtDecoded.accountId);
        return res.status(200).json({
            success: true,
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    };
};

exports.getConversationList = async (req, res) => {
    try {
        const conversationList = await Conversation.getConversationList(req.jwtDecoded.accountId);
        return res.status(200).json({
            success: true,
            result: conversationList
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    };
}
