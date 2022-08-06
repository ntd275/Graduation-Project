const Account = require("../models/Account");
const bcrypt = require('bcrypt')
const config = require('../config/config')

exports.getAccountById = async (req, res) => {
    try {
        const account = await Account.getAccount(req.params.id);
        account.password = undefined;
        return res.status(200).json({
            success: true,
            result: account,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            err,
        });
    }
};

exports.editAccount = async (req, res) => {
    try {
        if (req.body.dateOfBirth) {
            req.body.dateOfBirth = new Date(req.body.dateOfBirth);
        }
        await Account.editAccount(req.params.id, req.body);
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

exports.changePassword = async (req, res) => {
    try {
        let account = await Account.getAccount(req.jwtDecoded.accountId);
        let match = await bcrypt.compare(req.body.oldPassword, account.password)
        if (!match) {
            return res.status(200).json({
                success: false,
                message: "Mật khẩu cũ không đúng"
            })
        }
        let newPassword = await bcrypt.hash(req.body.newPassword, config.saltRounds)
        await Account.updatePassword(req.jwtDecoded.accountId, newPassword)
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

exports.search = async (req, res) => {
    try {
        const result = await Account.searchByName(req.body.name, req.body.page || 1, req.body.perPage || 100)
        result.data = result.data.map(i => ({...i,password: undefined}))
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
