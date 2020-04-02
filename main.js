require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
var moment = require('moment');
var db = require('./models');

var corona = require('./middlewares/coronaMiddleware');
var donate = require('./middlewares/donateMiddleware');

const news = require('./models').news;
const donation = require('./models').donation;

var corsOptions = {
    origin: 'http://geexec.com',
    optionsSuccessStatus: 200
}

// Security headers
app.use(cors());
app.set('trust proxy', true);
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.locals.moment = moment;
app.locals.hideEmail = hideEmail;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + '/views'))
app.use((req, res, next) => {
    req.realIp = req.headers['x-real-ip'] || req.connection.remoteAddress || '';
    return next();
});

// serve frontend files
app.use(express.static('public'));

// Check database connection
db.sequelize
    .authenticate()
    .then(() => {
        console.log('> Database connection has been established successfully.');

        // sync database tables
        db.sequelize.sync({
                // force: true
            })
            .then(() => {
                console.log('> Database & tables created!');
            });
    })
    .catch(err => {
        console.error('> Unable to connect to the database:', err);
    });

console.log(moment().utc().add(1, 'days').format('YYYY-MM-DD 18:30:01'));

app.use('/covid19/admin', require('./routes/admin'));

app.get("/", corona.getLiveCount,
    corona.getLiveNews,
    function (req, res) {

        news.findAll({
            limit: 6,
            where: {
                type: 0,
            },
            order: [
                ['createdAt', 'DESC']
            ]
        }).then(news_list => {
            // console.log(news_list);
            res.render("dashboard", {
                page: 'dashboard',
                news_list: news_list,
                live_news: req.liveNews.newsdata,
                corona_data: {
                    totalcases: req.liveCount.totalcases,
                    totalrecovered: req.liveCount.totalrecovered,
                    totaldeaths: req.liveCount.totaldeaths,
                    statename: req.liveCount.statename,
                    statecount: req.liveCount.statecount,
                    statedata: req.stateData,
                    covidIndiaData: {
                        raw: req.covidIndia.raw,
                    }
                }
            });
        });
    });

app.get("/news", corona.getLiveCount, function (req, res) {
    news.findAll({
        limit: 12,
        where: {
            type: 0,
        },
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(news_list => {
        // console.log(news_list);
        res.render("news", {
            page: 'news',
            news_list: news_list,
            corona_data: {
                totalcases: req.liveCount.totalcases,
                totalrecovered: req.liveCount.totalrecovered,
                totaldeaths: req.liveCount.totaldeaths,
            }
        });
    });
});

app.get("/covid19/news/api", cors(corsOptions), function (req, res) {
    var page = req.query.page;
    var count = req.query.count;

    if (!page || !count)
        res.send({
            result: 'fail'
        });

    // console.log(Number(page) - 1);

    news.findAll({
        limit: Number(count),
        offset: Number(page) == 1 ? 0 : count * (Number(page) - 1),
        where: {
            type: 0,
        },
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(news_list => {
        res.send(news_list)
    });
});

// app.get("/live", corona.getLiveCount, corona.getLiveNews, function (req, res) {
//     res.render("live-news", {
//         page: 'live-news',
//         live_news: req.liveNews.newsdata,
//         corona_data: {
//             totalcases: req.liveCount.totalcases,
//             totalrecovered: req.liveCount.totalrecovered,
//             totaldeaths: req.liveCount.totaldeaths,
//         }
//     });
// });

app.get("/livestream", corona.getLiveCount, function (req, res) {
    res.render("live", {
        page: 'live',
        corona_data: {
            totalcases: req.liveCount.totalcases,
            totalrecovered: req.liveCount.totalrecovered,
            totaldeaths: req.liveCount.totaldeaths,
        }
    });
});

app.get("/donation", function (req, res) {
    res.render("donation", {
        page: 'donation',
    });
});

app.get("/donation/about", function (req, res) {
    res.render("about-donation", {
        page: 'about-donation',
    });
});

app.get("/donate", donate.countDonations, function (req, res) {
    res.render("donate", {
        page: 'donate',
        donation_data: {
            total: req.donationCountAll,
            today: req.donationCountToday,
            percent: Math.ceil(req.donationCountAll / 10000 * 100),
            donationList: req.donationList,
            todayAdd: req.followerAddToday,
            totalAdd: req.followerAddTotal,
        }
    });
});

app.post("/covid19/donate/addnew", cors(corsOptions), function (req, res) { //donate.captchaVerity, 

    if (!req.body.first_name || !req.body.last_name ||
        !req.body.email_id || !req.body.instagram_id ||
        !req.body.facebook_id || !req.body.donator_fb_id ||
        !req.body.donator_insta_id || !req.body.donator_name) {
        return res.send({
            status: 'failure',
            messege: "All fields are required"
        });
    }

    donation.findOrCreate({
        defaults: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email_id: req.body.email_id,
            instagram_id: req.body.instagram_id,
            facebook_id: req.body.facebook_id,
            donator_fb_id: req.body.donator_fb_id,
            donator_insta_id: req.body.donator_insta_id,
            donator_name: req.body.donator_name
        },
        where: {
            email_id: req.body.email_id,
        }
    }).then(data => {
        res.send({
            status: 'success',
        });
    });
});

// app.get("/covid19/live-tv", corona.getLiveCount, function (req, res) {
//     res.render("video-ex", {
//         page: 'video-play',
//         corona_data: {
//             totalcases: req.liveCount.data.totalcases,
//             totalrecovered: req.liveCount.data.totalrecovered,
//             totaldeaths: req.liveCount.data.totaldeaths
//         }
//     });
// })

app.get("/about", corona.getLiveCount, function (req, res) {
    res.render("about", {
        page: 'about',
        corona_data: {
            totalcases: req.liveCount.totalcases,
            totalrecovered: req.liveCount.totalrecovered,
            totaldeaths: req.liveCount.totaldeaths,
        }
    });
});

app.get("/helpline", corona.getLiveCount, function (req, res) {
    res.render("helpline", {
        page: 'helpline',
        corona_data: {
            totalcases: req.liveCount.totalcases,
            totalrecovered: req.liveCount.totalrecovered,
            totaldeaths: req.liveCount.totaldeaths,
        }
    });
});

app.get("/faq", corona.getLiveCount, function (req, res) {
    res.render("faq", {
        page: 'faq',
        corona_data: {
            totalcases: req.liveCount.totalcases,
            totalrecovered: req.liveCount.totalrecovered,
            totaldeaths: req.liveCount.totaldeaths,
        }
    });
});

app.get("/privacy", corona.getLiveCount, function (req, res) {
    res.render("pp", {
        page: 'privacy',
        corona_data: {
            totalcases: req.liveCount.totalcases,
            totalrecovered: req.liveCount.totalrecovered,
            totaldeaths: req.liveCount.totaldeaths,
        }
    });
});

app.get("/declaimer", corona.getLiveCount, function (req, res) {
    res.render("dp", {
        page: 'declaimer',
        corona_data: {
            totalcases: req.liveCount.totalcases,
            totalrecovered: req.liveCount.totalrecovered,
            totaldeaths: req.liveCount.totaldeaths,
        }
    });
});

app.get("**", corona.getLiveCount, function (req, res) {
    res.redirect("/");
});

if (process.env.NODE_ENV == 'production') {
    app.listen();
} else {
    app.listen(process.env.PORT, err => {
        if (err) throw err;
        console.log(`> Server running on http://localhost:${process.env.PORT}`);
    });
}

function hideEmail(emailId) {
    var a = emailId.split("@");
    var cMail = a[0];
    var a = a[1].split('.');
    var cDoamin = a[0];
    var cTld = a[1];

    var mail = "";
    var domain = "";
    var tld = "";
    for (var i in cMail) {
        if (i > 0 && i < cMail.length - 1) mail += "*";
        else mail += cMail[i];
    }
    for (var i in cDoamin) {
        if (i > 0 && i < cDoamin.length) domain += "*";
        else domain += cDoamin[i];
    }
    for (var i in cTld) {
        if (i > 0 && i < cTld.length) tld += "*";
        else tld += cTld[i];
    }
    return mail + "@" + domain + '.' + tld;
}