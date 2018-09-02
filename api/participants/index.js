const router = require('express').Router();
const generateToken = require('../../utils/generateToken');
const httpRequest = require('request-promise-native');

module.exports = (db) => {
    const participantDB = require('../../db/participant')(db);

    //POST participant/:id
    router.post('/', async (request, response) => {
        try {
            const new_id = request.body.id;
            const newToken = generateToken(request.body.id);
            console.log(newToken);
            let newOrder = {
                "events": request.body.events,
                "sum": request.body.sum,
                "token": newToken,
                "paid": false
            };
            const newParticipant = await participantDB.get(new_id);
            console.log(newParticipant);
            newParticipant.orders.push(newOrder);
            const number = newParticipant.phone;
            console.log(number);
            const numbers = JSON.stringify(number);
            console.log(numbers);
            await participantDB.replace(new_id, newParticipant);
            response.status(200).json({message: "success"});
            const sender = process.env.SMS_SENDER;
            const apiKey = process.env.SMS_API_KEY;
            const test = process.env.SMS_TEST;
            const message = `Dear Event Manager, Your credentials for accessing the SMS portal for the event xyz are Username: ${new_id}, Password: ${newToken}
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
        }
        catch (e) {
            console.log(e)
        }
    });
    return router;
};