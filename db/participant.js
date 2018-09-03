const ObjectId = require('mongodb').ObjectId;
module.exports = (db) => ({
    insert: (id, name, mobile, year, branch, order) => {
        return db.collection('participants').insertOne({
            id: id,
            name: name,
            phone: mobile,
            year: year,
            branch: branch,
            orders: order
        });
    },
    get: (id) => {
        return db.collection('participants').findOne({id: id});
    },
    replace: (id, newParticipant) => {
        return db.collection('participants').findOneAndReplace({id: id}, newParticipant);
    },
    getParticipant: (id) => {
        return db.collection('events').findOne({_id: ObjectId(id)});
    },
    updateParticipant: (id, newEvent) => {
        return db.collection('events').findOneAndReplace({_id: ObjectId(id)}, newEvent);
    }
});