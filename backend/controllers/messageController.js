const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

exports.createMessage = async (req, res) => {
    try {
        await Message.createMessage(req.body.conversationId, req.jwtDecoded.accountId, req.body.message);
        return res.status(200).json({
            success: true,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            err,
        });
    }
}

exports.recallMessage = async (req, res) => {
    try {
        await Message.recallMessage(req.body.messageId)
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

exports.createMessageCall = async (req, res) => {
    try {
        await Message.createMessageCall(req.body.conversationId, req.jwtDecoded.accountId, req.body.callDuration)
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
}

exports.getMessageInConversation = async (req, res) => {
    try {
        const conversation = await Conversation.getConversationById(req.body.conversationId);
        let time;
        if (conversation.account1 === req.jwtDecoded.accountId) {
            time = new Date(conversation.account1DeleteTime);
        } else {
            time = new Date(conversation.account2DeleteTime);
        }
        const messageList = await Message.getMessageList(req.body.conversationId, time)
        return res.status(200).json({
            success: true,
            result: messageList
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    };
}
