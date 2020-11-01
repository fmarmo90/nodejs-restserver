const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config').config;

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
            data: user.id/*,
            exp: Math.floor(Date.now() / 1000) + 15,*/
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

module.exports = app