const ObjectId = require('mongodb').ObjectId;

module.exports = (db) => ({
    get: (username) => {
        return db.collection('event_user').findOne({_id: username});
    },
    insterNewEvent: (event_id, newParticipant) => {
        return db.collection('events').findOneAndReplace({_id:ObjectId(event_id)},newParticipant);
    }
});