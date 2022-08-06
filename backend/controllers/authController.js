const config = require('../config/config')
const jwtHelper = require('../helpers/jwtToken')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const Account = require('../models/Account');

const tokenList = {}
const otpList = {}

exports.login = async (req, res) => {
    try {
        let user = await Account.getAccountByEmail(req.body.email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email hoặc mật khẩu không chính xác"
            })
        }

        let match = await bcrypt.compare(req.body.password, user.password)
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Email hoặc mật khẩu không chính xác"
            })
        }

        let accessToken = await jwtHelper.generateToken(user, config.accessTokenSecret, config.accessTokenLife)
        let refreshToken = await jwtHelper.generateToken(user, config.refreshTokenSecret, config.refreshTokenLife)
        tokenList[refreshToken] = { accessToken, refreshToken };
        res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true, maxAge: config.refreshTokenCookieLife, sameSite: "Lax", domain:"http://hola.southeastasia.cloudapp.azure.com/" });
        return res.status(200).json({
            success: true,
            accessToken,
            id: user.accountId,
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            err,
        });
    }
}

exports.register = async (req, res) => {
    try {
        const account = req.body;
        const checkAccount = await Account.getAccountByEmail(account.email);
        if (checkAccount) {
            return res.status(400).json({
                success: false,
                message: "Email này đã đăng ký tài khoản",
            })
        }
        account.password = await bcrypt.hash(account.password, config.saltRounds)
        await Account.createAccount(account);
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

exports.logOut = async (req, res) => {
    var refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        delete tokenList[refreshToken];
        res.clearCookie('refreshToken');
        res.status(200).json({
            success: true
        })
    } else {
        res.status(403).json({
            success: false
        })
    }
}

exports.refreshToken = async (req, res) => {
    let refreshTokenFromClient = req.cookies.refreshToken;
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            let decoded = await jwtHelper.verifyToken(refreshTokenFromClient, config.refreshTokenSecret);
            let user = await Account.getAccount(decoded.accountId);
            console.log(user);
            let accessToken = await jwtHelper.generateToken(user, config.accessTokenSecret, config.accessTokenLife);
            return res.status(200).json({
                success: true,
                accessToken
            });
        } catch (error) {
            console.log(error)
            delete tokenList[refreshTokenFromClient];
            res.status(403).json({
                success: false,
                message: 'Invalid refresh token.',
            });
        }
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.',
        });
    }
};

exports.sendOtp = async (req, res) => {
    const emailOption = {
        service: config.emailService,
        auth: {
            user: config.emailUser,
            pass: config.emailPassword
        }
    };
    const transporter = nodemailer.createTransport(emailOption);
    try {
        const accountEmail = req.body.email;
        const account = await Account.getAccountByEmail(accountEmail);
        if (!account) {
            return res.status(400).send({
                success: false,
                message: "Email này chưa đăng ký tài khoản"
            });
        }
        transporter.verify(async function (error, success) {
            if (error) {
                return res.status(500).send({
                    success: false,
                    message: error.message || "Có lỗi khi gửi OTP"
                });
            }
            const otp = Math.floor(100000 + Math.random() * 900000);
            const mail = {
                from: config.emailUser,
                to: accountEmail,
                subject: '[Hola] Quên mật khẩu',
                text: 'Mã xác thực của bạn là ' + otp + '. Mã này có hiệu lực trong vòng 5 phút',
            };
            transporter.sendMail(mail, async function (error, info) {
                if (error) {
                    return res.status(500).send({
                        success: false,
                        message: error.message || "Some errors occur while sending email"
                    });
                }
                const data = await Account.getAccountByEmail(accountEmail);
                let otpToken = await jwtHelper.generateToken(data, config.otpTokenSecret, config.otpTokenLife);
                otpList[accountEmail] = otp
                return res.json({
                    success: true,
                    otpToken: otpToken
                });        
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Có lỗi khi gửi OTP"
        });
    }
}

exports.checkOtp = async (req, res) => {
    const otpToken = req.body.otpToken
    if (otpToken) {
        try {
            const data = await jwtHelper.verifyToken(otpToken, config.otpTokenSecret);
            if (data && (req.body.otp == otpList[data.email])) {
                let accessToken = await jwtHelper.generateToken(data, config.accessTokenSecret, config.accessTokenLife);
                return res.json({
                    success: true,
                    accessToken: accessToken
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Mã OTP không đúng",
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                message: "OTP đã hết hạn. Vui lòng thực hiện lại",
            });
        }
    } else {
        return res.status(400).send({
            success: false,
            message: 'No token provided.',
        });
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        let newPassword = await bcrypt.hash(req.body.newPassword, config.saltRounds)
        let count = await Account.updatePassword(req.jwtDecoded.accountId, newPassword)
        if (count == 0) {
            return res.status(418).json({
                success: false,
                message: "Không thể đổi mật khẩu. Vui lòng thử lại"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Mật khẩu đã đổi thành công"
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            success: false,
            message: "Có lỗi khi đổi mật khẩu. Vui lòng thử lại",
        });
    }
}

exports.checkAuth = async (req, res) => {
    res.json({
        success: true
    })
}
