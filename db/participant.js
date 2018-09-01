module.exports = (db) => ({
    insert: (id, name, mobile, year, branch, date) => {
        return db.collection('participants').insertOne({
            id: id,
            name: name,
            phone: mobile,
            year: year,
            branch: branch,
            date: date
        });
    }
});