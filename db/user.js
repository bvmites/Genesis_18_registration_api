const crypto = require('crypto');
const hashPassword = require('../utils/hashPassword');
module.exports = (db) => ({
    create: (id, number, token) => {
        const salt = crypto.randomBytes(512).toString('hex');
        const iterations = Math.floor((Math.random() * 500) + 500);
        const hashedPassword = hashPassword(token, salt, iterations);
        return db.collection('users').insertOne({
            id: id,
            mobile: number,
            password: {
                hash: hashedPassword,
                salt,
                iterations
            }
        });
    },
    get: (id) => {
        return db.collection('users').findOne({
            id: id
        });
    }

});