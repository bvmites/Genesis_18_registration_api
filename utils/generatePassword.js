const crypto = require('crypto');

module.exports = (username) => {
    const key = process.env.HASH_SECRET;
    return crypto.createHmac('sha512', key)
        .update(username)
        .digest('hex')
        .toString()
        .slice(0, 5);
};