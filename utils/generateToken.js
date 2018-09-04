const crypto = require('crypto');
const hashPassword = require('./hashPassword');

module.exports = (username) => {
    const salt = crypto.randomBytes(512).toString('hex');
    const iterations = Math.floor((Math.random() * 500) + 500);
    const hashedPassword = hashPassword(username, salt, iterations);
    const key = process.env.HASH_SECRET;
    return crypto.createHmac('sha512', key)
        .update(hashedPassword)
        .digest('hex')
        .toString()
        .slice(0, 4);
};