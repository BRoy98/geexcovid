require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
var db = require('./models');

const news = require('./models').news;

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

app.get("/covid19", function (req, res) {
    res.render("dashboard", {
        page: 'dashboard'
    });
})

app.get("/covid19/news", function (req, res) {

    news.findAll({
        limit: 10
    }).then(news_list => {
        console.log(news_list);
        res.render("news", {
            page: 'news',
            news_list: news_list
        });
    });
})

// app.get("/info", function (req, res) {
//     res.render("information", {
//         page: 'information'
//     });
// })

if (process.env.NODE_ENV == 'production') {
    app.listen();
} else {
    app.listen(process.env.PORT, err => {
        if (err) throw err;
        console.log(`> Server running on http://localhost:${process.env.PORT}`);
    });
}