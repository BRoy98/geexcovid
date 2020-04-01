'use strict';
const axios = require('axios');
var moment = require('moment');
const Op = require('../models').Sequelize.Op;
const donation = require('../models').donation;
const follower_add = require('../models').follower_add;

exports.captchaVerity = async (req, res, next) => {
    if (!req.body.captcha) {
        return res.send({
            status: 'failure',
            messege: "Captcha verification failed"
        });
    }
    try {
        const siteverify = await axios.post('https://www.google.com/recaptcha/api/siteverify', {
            secret: '6LdC7-QUAAAAAK6QbyLbM5MIHqyJBmYqvOokfFCb',
            response: req.body.captcha
        });

        // console.log(siteverify);

        if (!siteverify) {
            return res.send({
                status: 'failure',
                messege: "Captcha verification failed"
            });
        }

        next();
    } catch (error) {
        return res.send({
            status: 'failure',
            messege: "Captcha verification failed"
        });
    }
}

exports.countDonations = async (req, res, next) => {
    var donationList = await donation.findAll({
        limit: 10,
        order: [
            ['createdAt', 'DESC']
        ]
    });

    var donationCountAll = await donation.count({
        distinct: true,
        col: 'id'
    });

    // gte current time
    var curTime = moment().utc().format('HH:mm');

    // set filter time to filter as if query date is same as UTC date
    var dateFilter = [moment().utc().subtract(1, 'days').format('YYYY-MM-DD 14:30:01'), moment().utc().format('YYYY-MM-DD 14:30:00')];

    // if time is more than 18:30 but less than 19:00
    if (Number(curTime.split(':')[0]) == 18 && Number(curTime.split(':')[1]) > 29) {
        // set filter time to filter as if query date is greater than UTC date
        dateFilter = [moment().utc().format('YYYY-MM-DD 14:30:01'), moment().utc().add(1, 'days').format('YYYY-MM-DD 14:30:00')];
        console.log(dateFilter);

        // if time is more than 19:00
    } else if (Number(curTime.split(':')[0]) > 18) {
        // set filter time to filter as if query date is greater than UTC date
        dateFilter = [moment().utc().format('YYYY-MM-DD 14:30:01'), moment().utc().add(1, 'days').format('YYYY-MM-DD 14:30:00')];
        console.log(dateFilter);
    }

    var donationCountToday = await donation.count({
        distinct: true,
        where: {
            createdAt: {
                [Op.between]: [moment().utc().subtract(1, 'days').format('YYYY-MM-DD 14:30:01'), moment().utc().format('YYYY-MM-DD 18:30:00')]
            }
        },
        col: 'id'
    });

    // todays addition
    var followerAddToday = await follower_add.findOne({
        where: {
            date: {
                [Op.between]: dateFilter
            }
        },
    });

    // total addition
    var followerAddTotal = await follower_add.findAll();
    var totalAmount = 0;

    // add all additions
    followerAddTotal.forEach((adds) => {
        totalAmount = totalAmount + Number(adds.amount);
    })

    // console.log('followerAddToday', followerAddToday);

    req.donationList = donationList;
    req.donationCountAll = donationCountAll;
    req.donationCountToday = donationCountToday;
    req.followerAddToday = followerAddToday;
    req.followerAddTotal = totalAmount;

    next();
}