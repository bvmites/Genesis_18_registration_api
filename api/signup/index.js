const router = require('express').Router();
const httpRequest = require('request-promise-native');
const generatePassword = require('../../utils/generatePassword');
module.exports = (db) => {

    const userDb = require('../../db/user')(db);
    const participantDb = require('../../db/participant')(db);
    router.post('/', async (req, res) => {
        try {
            const error = new Error();
            console.log(req.body);
            const id = req.body.id;
            const mobile = req.body.number;
            const name = req.body.name;
            const branch = req.body.branch;
            const year = req.body.year;
            const date = req.body.date;
            const numbers = JSON.stringify(mobile);
            console.log(numbers);
            const result = await userDb.get(id);
            if (result !== null) {
                error.message = 'User Already exist';
                throw error;
            }
            const token = generatePassword(id);
            console.log(token);
            const insert = await userDb.create(id, mobile, token);
            if (insert != null) {
                res.status(200).json("user inserted");
            }
            else {
                error.message = "Error related to insert data";
                throw error;
            }
            const participant = await participantDb.insert(id, name, mobile, year, branch, date);
            if (participant != null) {
                res.status(200).json("participant inserted");
            }
            else {
                error.message = "Error related to insert participant data";
                throw error;
            }
            const sender = process.env.SMS_SENDER;
            const apiKey = process.env.SMS_API_KEY;
            const test = process.env.SMS_TEST;
            const message = `Dear Event Manager, Your credentials for accessing the SMS portal for the event xyz are Username: ${id}, Password: ${token}
Team Udaan`;
            const apiRequest = {
                url: 'http://api.textlocal.in/send',
                form: {
                    apiKey,
                    numbers,
                    test,
                    sender,
                    message
                }
            };
            const apiResponse = await httpRequest.post(apiRequest);
            console.log(apiResponse);

        } catch (e) {
            console.log(e.message);
        }
    });
    return router;
};
