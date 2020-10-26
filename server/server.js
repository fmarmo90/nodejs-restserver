const config = require('./config');
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', (req, res) => {
    res.json('get users')
})

app.get('/user/:id', (req, res) => {
    let id = req.params.id

    res.json({
        id,
        name: 'Federico'
    })
})

app.post('/user', (req, res) => {
    let body = req.body;

    if (!body.name) {
        res.status(400).json({
            error: true,
            msg: 'The name of the user is required'
        })
    } else {
        res.json({
            user: req.body
        })
    }
})

app.put('/user/:id', (req, res) => {
    let id = req.params.id

    res.json({
        id
    })
})

app.delete('/user', (req, res) => {
    res.json('delete user')
})

app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`)
})