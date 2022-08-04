const Friend = require('../models/Friend');
const FriendRequest = require('../models/FriendRequest');

exports.acceptFriendRequest = async (req, res) => {
    try {
        await FriendRequest.deleteFriendRequest(req.body.accountId, req.jwtDecoded.accountId)
        await Friend.createFriend(req.body.accountId, req.jwtDecoded.accountId)
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

exports.refuseFriendRequest = async (req, res) => {
    try {
        await FriendRequest.deleteFriendRequest(req.body.accountId, req.jwtDecoded.accountId)
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

exports.getFriendRequestList = async (req, res) => {
    try {
        const friendRequestList = await FriendRequest.getFriendRequest(req.jwtDecoded.accountId);
        for (let i = 0; i < friendRequestList.length; i++) {
            const temp1 = await Friend.getFriendList(friendRequestList[i].accountId);
            const temp2 = temp1.filter(e => e.account1 === req.jwtDecoded.accountId || e.account2 === req.jwtDecoded.accountId);
            friendRequestList[i].mutualFriend = temp2.length;
        }
        return res.status(200).json({
            success: true,
            result: friendRequestList,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            err,
        });
    }
}

exports.sendFriendRequest = async (req, res) => {
    try {
        await FriendRequest.createFriendRequest(req.jwtDecoded.accountId, req.body.accountId)
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

exports.cancelFriendRequest = async (req, res) => {
    try {
        await FriendRequest.deleteFriendRequest(req.jwtDecoded.accountId, req.body.accountId)
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

exports.getSendFriendRequestList = async (req, res) => {
    try {
        const friendRequestList = await FriendRequest.getSendFriendRequest(req.jwtDecoded.accountId)
        return res.status(200).json({
            success: true,
            result: friendRequestList,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            err,
        });
    }
}