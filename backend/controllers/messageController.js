const Message = require('../models/Message');

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

exports.getMessageInConversation = async (req, res) => {
    try {
        const messageList = await Message.getMessageList(req.body.conversationId)
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
