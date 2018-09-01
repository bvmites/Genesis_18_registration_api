const router = require('express').Router();
const httpRequest = require('request-promise-native');
const generatePassword = require('../../utils/generatePassword');
module.exports = (db) => {

    const userDb = require('../../db/user')(db);

    router.post('/', async (req, res) => {
        try {
            console.log(req.body);
            const id = req.body.id;
            const mobile = req.body.number;
            const numbers = JSON.stringify(mobile);
            console.log(numbers);
            const token = generatePassword(id);
            console.log(token);
            const insert = await userDb.create(id, mobile,token);
            if (insert != null) {
                res.status(200).json("ok");
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
            console.log('Error related to insert data')
        }
    });
    return router;
};
