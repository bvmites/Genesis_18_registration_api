const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const MongoClient = require('mongodb').MongoClient;
const bodyparser = require('body-parser');

const app = express();

const signup = require("./api/signup");
const user = require("./api/user");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const server = require('http').createServer(app);
server.listen(4000);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

dotenv.config();

(async () => {
    try{
        const client = await MongoClient.connect(process.env.DB);
        console.log("Connected to database");
        const db = client.db('Genesis-18');
        app.use('/signup',signup(db));
        app.use(function(req, res, next) {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
        app.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });

    }
    catch (e) {
        console.log("Error");
    }
})();

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   let err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
