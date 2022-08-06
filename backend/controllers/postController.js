const Post = require('../models/Post');
const Friend = require('../models/Friend');

exports.createPost = async (req, res) => {
    try {
        await Post.createPost({...req.body, author: req.jwtDecoded.accountId, createdTime: new Date()});
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

exports.editPost = async (req, res) => {
    try {
        await Post.editPost(req.params.id, req.body)
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

exports.deletePost = async (req, res) => {
    try {
        await Post.deletePost(req.params.id)
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

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.getPost(req.params.id)
        return res.status(200).json({
            success: true,
            result: post
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    };
};

exports.getPostListInProfile = async (req, res) => {
    try {
        const postList = await Post.getPostByAccountId([req.params.id]);
        return res.status(200).json({
            success: true,
            result: postList
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    };
};

exports.getPostListInNewFeed = async (req, res) => {
    try {
        const myAccountId = req.jwtDecoded.accountId;
        const friendList = await Friend.getFriendList(myAccountId);
        const friendIdList = friendList.map((friend) => friend.account1 == myAccountId ? friend.account2 : friend.account1)
        const postList = await Post.getPostByAccountId([req.jwtDecoded.accountId, ...friendIdList]);
        return res.status(200).json({
            success: true,
            result: postList.map(post => ({...post, password: undefined}))
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    };
};

exports.search = async (req, res) => {
    try {
        const postList = await Post.search(req.body.keyword, req.body.page || 1, req.body.perPage || 100);
        return res.status(200).json({
            success: true,
            result: postList
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    };
};