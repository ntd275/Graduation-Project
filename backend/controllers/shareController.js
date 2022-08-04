const Share = require('../models/Share');

exports.createShare = async (req, res) => {
    try {
        await Share.createShare(req.body.postId, req.jwtDecoded.accountId, req.body.content);
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

exports.getShareInPost = async (req, res) => {
    try {
        const shareList = await Share.getShareByPostId(req.body.postId)
        return res.status(200).json({
            success: true,
            result: shareList
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    };
}

exports.getShareByAccountId = async (req, res) => {
    try {
        const shareList = await Share.getShareByAccountId(req.body.accountId);
        return res.status(200).json({
            success: true,
            result: shareList
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    };
}
