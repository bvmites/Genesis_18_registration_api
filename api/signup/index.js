const router = require('express').Router();
const httpRequest = require('request-promise-native');

module.exports = (db) => {

    const userDb = require('../../db/user')(db);

    router.post('/', async (req, res) => {
        try {
            console.log(req.body);
            const id = req.body.id;
            const mobile = req.body.number;
            const insert = await userDb.create(id, mobile);
            if (insert != null) {
                res.status(200).json("ok");
            }
        } catch (e) {
            console.log('Error related to insert data')
        }
    });
    return router;
};
