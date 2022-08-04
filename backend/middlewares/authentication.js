const jwtHelper = require('../helpers/jwtToken')
const config = require('../config/config')
const accessTokenSecret = config.accessTokenSecret

exports.isAuth = async (req, res, next) => {
    const tokenFromClient = req.body.token || req.headers["x-access-token"];
    if (tokenFromClient) {
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            req.jwtDecoded = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }
    } else {
        return res.status(403).send({
            message: 'No token provided',
        });
    }
}