const router = require('express').Router();
const generateToken = require('../../utils/generateToken');

module.exports = (db) => {
    const participantDB = require('../../db/participant')(db);

    //POST participant/:id
    router.post('/',async (request, response) => {
        try {
            new_id = request.body.id;
            newToken = generateToken(request.body.id);
            let newOrder = {
                "events": request.body.events,
                "sum": request.body.sum,
                "token": newToken,
                "paid": false
            };
            const newParticipant = await participantDB.get(new_id);
            newParticipant.orders.push(newOrder);
            const number = newParticipant.number;
            await participantDB.replace(new_id, newParticipant);
            response.status(200).json({message:"success"});
        }
        catch (e) {
            console.log(e)
        }
    });
    return router;
};