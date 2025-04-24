const { HTTP_STATUS_CODES } = require("../config/constants");
const client = require("../config/redis");

const cache = async (req, res, next) => {

    try {
        const user = await client.get('user');
        const tasks = await client.get('tasks');
        // console.log(user);
        console.log(tasks);

        if (!user) {
            return res.status(404).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: '',
                data: '',
                error: ''
            })
        }

        req.user = JSON.parse(user);
        req.tasks = JSON.parse(tasks);
        next();

    } catch (err) {
        console.error(err);
        next();
    }
};

module.exports = { cache }