const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');
const _ = require('underscore');

app.get('/users', verifyToken, (req, res) => {
    let from = req.query.from || 0;
    let limit = req.query.limit || 5;
    let active = req.query.active || true;

    User.find({ active }, 'name email img role active')
        .skip(Number(from))
        .limit(Number(limit))
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    msg: err
                })
            }

            User.find({ active })
                .countDocuments((err, count) => {
                    res.json({
                        users,
                        count
                    })
                })
        })
})

app.get('/user/:id', verifyToken, (req, res) => {
    let id = req.params.id

    res.json({
        id,
        name: 'Federico'
    })
})

app.post('/user', [verifyToken, verifyAdminRole], (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        password: bcrypt.hashSync(body.password, 10),
        email: body.email,
        role: body.role
    });

    user.save((err, userDb) => {
        if (err) {
            return res.status(400).json({
                msg: err
            })
        } 

        res.status(201).json({
            user: userDb
        })
    })
})

app.put('/user/:id', verifyToken, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, [
        'name',
        'email',
        'img',
        'role'
    ]);

    User.findOneAndUpdate(id, body, {
        new: true,
        runValidators: true,
        context: 'query'
    }, (err, doc) => {
        if (err) return res.status(400).json(err)

        if (!doc) {
            return res.status(404).json({
                error: 'User not found'
            });
        } 
        
        res.json({
            doc
        })
    })
})

app.delete('/user/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id

    User.findOneAndDelete(id, (err, doc) => {
        if (err) return res.status(400).json(err)

        if (!doc) {
            return res.status(404).json({
                error: 'User not found'
            });
        } 
        
        res.json({
            doc
        })
    })
})

module.exports = app