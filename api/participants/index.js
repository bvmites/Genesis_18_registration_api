const router = require('express').Router();
const generateToken = require('../../utils/generateToken');
const httpRequest = require('request-promise-native');

const newOrderSchema = require('../../schema/orderSchema');
const pendingOrderSchema = require('../../schema/pendingOrderSchema');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

module.exports = (db) => {
    const participantDB = require('../../db/participant')(db);
    const eventDB = require('../../db/newEvent')(db);

    //POST  participant/events
    router.post('/events', async (request, response) => {

        try{
            const new_id = request.body.username;
            const newparticipant = await participantDB.get(new_id);

            let events = [];
            let sum = 0;
            for (let i = 0; i < newparticipant.orders.length; i++) {
                events.push(newparticipant.orders[i].events);
                sum += newparticipant.orders[i].sum;
            }

            const ans = {
                "events": events,
                "sum": sum
            };

            response.status(200).send(ans);

        } catch (e) {
            if (e.code === 'ValidationException') {
                response.status(405).json({message: e.message});
            } else {
                response.status(500).json({message: e.message});
            }
        }
    });

    //POST participant/pending
    router.post('/pending', async (request,response) => {
        try {
            let order = request.body;
            const error = new Error();
            if (!validator.validate(order, pendingOrderSchema).valid) {
                error.message = 'Invalid request';
                error.code = 'ValidationException';
                throw error;
            }

            let pending = request.body.pendingOrder;
            let new_id = request.body.id;

            console.log(pending);

            let newParticipant = await participantDB.get(new_id);

            console.log(newParticipant);

            newParticipant.pendingOrder = pending;
            console.log(newParticipant);
            await participantDB.replace(new_id, newParticipant);

            response.status(200).json({"message": "success"})
        }
        catch (e) {
            if (e.code === 'ValidationException') {
                response.status(405).json({message: e.message});
            } else {
                response.status(500).json({message: e.message});
            }
        }
    });

    //GET participant/{id}
    router.get('/:id', async (request,response) => {
        try{
            let result = await participantDB.get(request.params.id);

            response.status(200).json({result});
        }
        catch (e) {
            console.log(e)
        }
    });

    //POST participant/
    router.post('/', async (request, response) => {

        try {
            let order = request.body;
            const error = new Error();
            if (!validator.validate(order, newOrderSchema).valid) {
                error.message = 'Invalid request';
                error.code = 'ValidationException';
                throw error;
            }

            const new_id = request.body.id;
            const newToken = generateToken(request.body.id);

            let newOrder = {
                "events": request.body.events,
                "sum": request.body.sum,
                "token": newToken,
                "paid": false,
                "paidTo":""
            };

            const newParticipant = await participantDB.get(new_id);
            const participantId = newParticipant._id;

            newParticipant.orders.push(newOrder);

            const number = newParticipant.phone;
            const numbers = JSON.stringify(number);

            let newEvent = [];
            for (let i = 0; i<newOrder.events.length; i++){
                let event = await eventDB.get(newOrder.events[i]);
                newEvent.push(event);
            }

            await participantDB.replace(new_id, newParticipant);
            response.status(200).json({message: "success"});
            const sender = process.env.SMS_SENDER;
            const apiKey = process.env.SMS_API_KEY;
            const test = process.env.SMS_TEST;
            const message = `Dear Participant, Your token for registered event is ${newToken}.
Team BVM`;
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

            for (let i = 0; i < newOrder.events.length; ++i) {
                const getParticipant = await participantDB.getParticipant(newOrder.events[i]);
                const eventId = getParticipant._id;
                getParticipant.participants.push(participantId);
                const updateParticipant = await participantDB.updateParticipant(eventId,getParticipant);
            }
        }
        catch (e) {
            console.log(e)
        }
    });

    return router;
};