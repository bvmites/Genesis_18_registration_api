const router = require('express').Router();
const jwt = require('jsonwebtoken');
const hashPassword = require('../../utils/hashPassword');

module.exports = (db) => {

    const userDB = require('../../db/user')(db);
    const participantDB = require('../../db/participant')(db);

    // POST /user/login
    router.post('/login', async (request, response) => {
        try {
            const id = request.body.id;
            const password = request.body.password;
            const result = await userDB.get(id);
            const participant = await participantDB.get(id);
            const error = new Error();
            if (!(id && password)) {
                error.message = 'Invalid request';
                error.code = 'MissingCredentials';
                throw error;
            }

            if (result === null) {
                error.message = 'Invalid username or password';
                error.code = 'UserDoesntExist';
                throw error;
            }

            if (result.password.hash === hashPassword(password, result.password.salt, result.password.iterations)) {
                const payload = {
                    user: {
                        id
                    }
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION_TIME});
                response.status(200).json({token,participant});
            }
            else {
                error.message = 'Invalid username or password';
                error.code = 'InvalidCredentials';
                throw error;
            }
        } catch (e) {
            console.log(e);
            if (e.code === 'MissingCredentials') {
                response.status(400);
            }
            else if (e.code in ['UserDoesntExist', 'InvalidCredentials']) {
                response.status(401);
            }
            else {
                response.status(500);
            }
            response.json({message: e.message});
        }
    });

    return router;

};