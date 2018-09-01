module.exports = (db) => ({
    create: (id, number) => {
        return db.collection('users').insertOne({
            id: id,
            mobile: number
        });
    }
});