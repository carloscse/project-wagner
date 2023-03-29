const express = require('express');
const mongoose = require("mongoose");
const userModel = require('./models/user');
const connectionModel = require('./models/connection');
const transactionModel = require('./models/transaction');
const routes = require('./routes/router');

const app = express();
app.use(express.json());
app.use('/', routes);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/views'));

// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// setup a database connection using mongoose
mongoose.connect('mongodb+srv://admin:Admin1234@cluster0.e6mhtio.mongodb.net/?retryWrites=true&w=majority')
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log('err', err))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});
app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/views/home.html');
});