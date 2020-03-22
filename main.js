require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

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

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/covid19", function (req, res) {
    res.render("dashboard", {
        page: 'dashboard'
    });
})

// app.get("/info", function (req, res) {
//     res.render("information", {
//         page: 'information'
//     });
// })

app.listen(process.env.PORT, err => {
    if (err) throw err;
    console.log(`> Server running on http://localhost:${process.env.PORT}`);
});