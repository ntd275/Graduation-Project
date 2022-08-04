const Friend = require("../models/Friend");
const Account = require("../models/Account");

exports.getFriendList = async (req, res) => {
    try {
        const friendList = await Friend.getFriendList(req.params.id);
        for (let i = 0; i < friendList.length; i++) {
            let temp;
            if (friendList[i].account1 == req.params.id) {
                temp = await Account.getAccount(friendList[i].account2);
            } else {
                temp = await Account.getAccount(friendList[i].account1);
            }
            friendList[i] = {...friendList[i], ...temp}
            const temp1 = await Friend.getFriendList(friendList[i].accountId);
            const temp2 = temp1.filter(e => (e.account1 === req.jwtDecoded.accountId && e.account2 !== friendList[i].accountId) || (e.account2 === req.jwtDecoded.accountId && e.account1 !== friendList[i].accountId));
            friendList[i].mutualFriend = temp2.length;
        }
        return res.status(200).json({
            success: true,
            result: friendList,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    }
};

exports.getSuggestFriend = async (req, res) => {
    try {
        const myAccountId = req.jwtDecoded.accountId;
        const friendList = await Friend.getFriendList(myAccountId);
        const friendIdList = friendList.map((friend) =>
            friend.account1 == myAccountId ? friend.account2 : friend.account1
        );
        let suggestFriendList = await Friend.getSuggestFriendList(friendIdList);
        suggestFriendList = suggestFriendList.map((suggestFriend) =>
            friendIdList.includes(suggestFriend.account1)
                ? suggestFriend.account2
                : suggestFriend.account1
        ).filter((suggestFriend) => !friendIdList.includes(suggestFriend) && suggestFriend != myAccountId);

        const result = await Account.getAccountList(suggestFriendList);
        for (let i = 0; i < result.length; i++) {
            const temp1 = await Friend.getFriendList(result[i].accountId);
            const temp2 = temp1.filter(e => e.account1 === req.jwtDecoded.accountId || e.account2 === req.jwtDecoded.accountId);
            result[i].mutualFriend = temp2.length;
        }
        return res.status(200).json({
            success: true,
            result: result,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    }
};

exports.unFriend = async (req, res) => {
    try {
        await Friend.deleteFriend(req.jwtDecoded.accountId, req.body.accountId)
        return res.status(200).json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    }
};
