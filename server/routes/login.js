const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config').config;

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(config.google_client_id);

const app = express();

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                msg: err
            });
        }
        
        if (!user) {
            return res.status(400).json({
                ok: false,
                err: '(Usuario) o contraseña incorrectos'
            })
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario o (contraseña) incorrectos'
            })
        }

        let token = jwt.sign({
            user: {
                id: user._id,   
                active: user.active,
                role: user.role
            }
        }, config.token_seed, {
            expiresIn: config.token_expiration_time
        });
        
        res.json({
            ok: true,
            user,
            token
        })
    })  
})


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.google_client_id
    });

    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    let token = req.body.token;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e.message
            })
        });

    User.findOne({ email: googleUser.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: err
            });
        }

        //User already exists
        if (user) {
            if (!user.google) {
                return res.status(400).json({
                    ok: false, 
                    err: `You already have an account created through our web`
                });
            } else {
                let token = jwt.sign({
                    user: {
                        id: user._id,   
                        active: user.active,
                        role: user.role
                    }
                }, config.token_seed, {
                    expiresIn: config.token_expiration_time
                });

                return res.json({
                    ok: true,
                    user,
                    token
                })
            }
        }
        //User doesn't exists
        else {
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((err, user) => {
                if (err) {
                    return res.status(500).json({
                        msg: err
                    });
                }

                let token = jwt.sign({
                    user: {
                        id: user._id,   
                        active: user.active,
                        role: user.role
                    }
                }, config.token_seed, {
                    expiresIn: config.token_expiration_time
                });

                return res.json({
                    ok: true,
                    user,
                    token
                })
            });
        }
    })
});


module.exports = app