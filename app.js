var dotenv = require("dotenv")
dotenv.config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./db/conn')
var usersRouter = require('./routes/users');
var ticketRouter = require("./routes/ticketRouter")

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/tambola',ticketRouter)

module.exports = app;
