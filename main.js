require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
var db = require('./models');
var corona = require('./middlewares/coronaMiddleware');

const news = require('./models').news;

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

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/covid19", corona.getLiveCount, function (req, res) {
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
            corona_data: {
                totalcases: req.liveCount.data.totalcases,
                totalrecovered: req.liveCount.data.totalrecovered,
                totaldeaths: req.liveCount.data.totaldeaths,
                statename: req.liveCount.data.statename,
                statecount: req.liveCount.data.statecount
            }
        });
    });
})

app.get("/covid19/news", corona.getLiveCount, function (req, res) {
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
                totalcases: req.liveCount.data.totalcases,
                totalrecovered: req.liveCount.data.totalrecovered,
                totaldeaths: req.liveCount.data.totaldeaths
            }
        });
    });
})

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
})

app.get("/covid19/faq", corona.getLiveCount, function (req, res) {
    res.render("faq", {
        page: 'faq',
        corona_data: {
            totalcases: req.liveCount.data.totalcases,
            totalrecovered: req.liveCount.data.totalrecovered,
            totaldeaths: req.liveCount.data.totaldeaths
        }
    });
})

// Admin routes

app.get("/covid19/admin/addnews", function (req, res) {
    res.render("add_news", {
        page: 'add_news',
        added: false
    });
})

app.post("/covid19/admin/addnews", function (req, res) {

    news.findOrCreate({
        defaults: {
            title: req.body.title,
            description: req.body.description,
            channel: req.body.channel,
            image: req.body.image_url,
            type: req.body.type,
            url: req.body.url,
        },
        where: {
            title: req.body.title,
        }
    }).then(news_list => {
        res.render("add_news", {
            page: 'add_news',
            added: true
        });
    });
})

if (process.env.NODE_ENV == 'production') {
    app.listen();
} else {
    app.listen(process.env.PORT, err => {
        if (err) throw err;
        console.log(`> Server running on http://localhost:${process.env.PORT}`);
    });
}