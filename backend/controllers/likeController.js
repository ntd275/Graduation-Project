const Like = require('../models/Like');

exports.like = async (req, res) => {
    try {
        await Like.createLike(req.body.postId, req.jwtDecoded.accountId)
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

exports.unLike = async (req, res) => {
    try {
        await Like.deleteLike(req.body.postId, req.jwtDecoded.accountId);
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

exports.getLikeInPost = async (req, res) => {
    try {
        const likeList = await Like.getLikeByPostId(req.body.postId);
        return res.status(200).json({
            success: true,
            result: likeList
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    };
}
