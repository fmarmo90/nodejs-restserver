const jwt = require('jsonwebtoken');
const config = require('../config').config;

function getTokenFromReq(req, res, callback) {
    try {
        let token = req.get('Authorization');

        if (!token) {
            return res.status(403).json({
                msg: 'Token no provided'
            })
        }

        token = token.split(' ')[1];

        callback(token);
    } catch(e) {
        return res.status(500).json({
            msg: e.message
        })
    }
}

let verifyToken = async (req, res, next) => {
    getTokenFromReq(req, res, (token) => {
        jwt.verify(token, config.token_seed, (err, data) => {
            if (err) {
                return res.status(401).json({
                    msg: err.message
                })
            }
    
            req.user = data.user;
    
            next()
        })
    })
}

let verifyAdminRole = (req, res, next) => {
    getTokenFromReq(req, res, (token) => {
        jwt.verify(token, config.token_seed, (err, data) => {
            if (err) {
                return res.status(401).json({
                    msg: err
                })
            }
    
            if (data.user.role !== 'ADMIN_ROLE') {
                return res.status(401).json({
                    msg: `You don't have permission to do this with your role`
                })
            }
    
            next()
        })
    });
}

module.exports = {
    verifyToken,
    verifyAdminRole
}