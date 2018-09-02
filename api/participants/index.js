// import {ObjectId} from "mongodb";

const router = require('express').Router();
const generateToken = require('../../utils/generateToken');

module.exports = (db) => {
    const participant = require('../../db/participant');

    //POST participant/:id
    router.post('/:id',async (request, response) => {
        id = request.params.id;
        newToken = generateToken(request.params.id);

        const newParticipant = db.collection('participant').findOne({_id: ObjectId(id)});
        console.log(newParticipant);

        // const newParticipant = {
        //     ...,
        //     "order": [
        //         {
        //             "events": request.body.events,
        //             "sum": request.body.sum,
        //             "token": newToken,
        //             "paid": false
        //         }
        //     ]
        // }
    });
    return router;
};