const Conversation = require('../models/Conversation');
const Account = require('../models/Account');
const Message = require('../models/Message');

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
        for(let i = 0; i < conversationList.length; i++) {
            const id = conversationList[i].account1 === req.jwtDecoded.accountId ? conversationList[i].account2 : conversationList[i].account1;
            conversationList[i].opponent = await Account.getAccount(id);
            let time;
            if (conversationList[i].account1 === req.jwtDecoded.accountId) {
                time = new Date(conversationList[i].account1DeleteTime);
            } else {
                time = new Date(conversationList[i].account2DeleteTime);
            }
            conversationList[i].lastMessage = await Message.getLastMessage(conversationList[i].conversationId, time);
        }
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
