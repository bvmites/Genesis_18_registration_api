const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const MongoClient = require('mongodb').MongoClient;
const bodyparser = require('body-parser');
const cors = require('cors');

const signup = require('./api/signup');
const user = require('./api/user');
const participant = require('./api/participants');

const auth = require('./middleware/auth');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

dotenv.config();
const server = require('http').createServer(app);
server.listen(4000);
(async () => {
    try {
        const client = await MongoClient.connect(process.env.DB, {useNewUrlParser: true});
        console.log('Connected to database.');
        const db = client.db('Genesis-18');

        app.use('/participant', auth, participant(db));
        app.use('/signup', signup(db));
        app.use('/user', user(db));

        app.use((req, res, next) => {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.use((err, req, res, next) => {
            res.status(err.status || 500).json({message: err.message});
        });
    } catch (e) {
        console.log('Cannot connect');
        console.log(e);
        process.exit(1);
    }
})();

module.exports = app;