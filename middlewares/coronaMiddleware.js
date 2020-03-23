'use strict';
const axios = require('axios');

exports.getLiveCount = async (req, res, next) => {
    const liveCount = await axios.get('https://cdn.abplive.com/coronastats/prod/coronastats.json');

    if (!liveCount) {
        res.send("SERVER ERROR");
    }

    req.liveCount = liveCount;
    next();
};