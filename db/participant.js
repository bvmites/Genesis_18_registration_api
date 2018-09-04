module.exports = (db) => ({
    insert: (id, name, mobile, year, branch, order, pendingOrder) => {
        return db.collection('participants').insertOne({
            id: id,
            name: name,
            phone: mobile,
            year: year,
            branch: branch,
            orders: order,
            pendingOrder: pendingOrder
        });
    },
    get: (id) => {
        return db.collection('participants').findOne({id: id});
    },
    replace: (id, newParticipant) => {
        return db.collection('participants').findOneAndReplace({id: id}, newParticipant);
    }
});