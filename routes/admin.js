const express = require('express');
const router = express.Router();

router.get("/addnews", function (req, res) {
    res.render("add_news", {
        page: 'add_news',
        added: false
    });
});

router.post("/addnews", function (req, res) {

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
});

generateUrl = (count) => {
    if (!count)
        count = 6;
    var date = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        date += performance.now(); //use high-precision timer if available
    }

    var url = '';
    for (var i = 0; i < count; i++) {
        url += 'x';
    }
    return url.replace(/[xy]/g, function (c) {
        var r = (date + Math.random() * 16) % 16 | 0;
        date = Math.floor(date / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

module.exports = router;