const router = require('express').Router();
const generateToken = require('../../utils/generateToken');
const httpRequest = require('request-promise-native');

const newOrderSchema = require('../../schema/orderSchema');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

module.exports = (db) => {
    const participantDB = require('../../db/participant')(db);

    //POST  participant/
    router.post('/events', async (request, response) => {

        const newOrder = request.body;
        try{
            const error = new Error();
            if (!validator.validate(newOrder, newOrderSchema).valid) {
                error.message = 'Invalid request';
                error.code = 'ValidationException';
                throw error;
            }
            const new_id = request.body.id;
            const newparticipant = await participantDB.get(new_id);
            console.log(newparticipant);
            let events = [];
            let sum = 0;
            for(let i=0; i< newparticipant.orders.length;i++){
                events.push(newparticipant.orders[i].events);
                sum += newparticipant.orders[i].sum;
            }
            const ans = {
                "events": events,
                "sum": sum
            };
            console.log(ans);
            response.status(200).send(ans);

        }catch (e) {
            if (e.code === 'ValidationException') {
                response.status(405).json({message: e.message});
            } else {
                response.status(500).json({message: e.message});
            }
        }
    });

    //POST participant/
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