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
    }
    // order: ()
});