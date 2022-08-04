const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
    try {
        await Comment.createComment(req.body.postId, req.jwtDecoded.accountId, req.body.comment)
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

exports.editComment = async (req, res) => {
    try {
        await Comment.editComment(req.params.id, req.body.comment)
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

exports.deleteComment = async (req, res) => {
    try {
        await Comment.deleteComment(req.params.id)
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

exports.getCommentByPostId = async (req, res) => {
    try {
        const commentList = await Comment.getCommentByPostId(req.params.id);
        return res.status(200).json({
            success: true,
            result: commentList
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    };
};