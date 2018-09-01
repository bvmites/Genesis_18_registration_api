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
            const numbers = [7405852057,7069307537];
            //numbers.push(mobile);
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
            const message = `Dear Participant your UserID is ${id} and Password is ${token}`;
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
