const config = require('./config').config;
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const mongoose = require('mongoose');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());
;
app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/', (req, res) => {
  res.send('Hello World!');
})

//Users routes
app.use(require('./routes/index'))

mongoose.connect(config.DbUrl, config.DbOptions, (err, res) => {
    if (err) throw err

    console.log('Base de datos online');
});

app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`)
})