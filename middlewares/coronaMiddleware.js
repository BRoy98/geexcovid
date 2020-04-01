'use strict';
const axios = require('axios');

exports.getLiveCount = async (req, res, next) => {
    var milliseconds = (new Date).getTime();

    try {
        const liveCount = await axios.get('https://cdn.abplive.com/coronastats/prod/coronastats.json');

        if (!liveCount) {
            res.send("SERVER ERROR");
        }

        var stateData = []
        for (var i = 0; i < liveCount.data.statecount.length; i++) {
            stateData.push({
                state: liveCount.data.statename[i],
                count: liveCount.data.statecount[i]
            })
        }

        stateData.sort(function (a, b) {
            return b.count - a.count
        })

        req.liveCount = liveCount;
        req.stateData = stateData;

        if (!liveCount) {
            res.send("SERVER ERROR");
        }
    } catch (error) {
        console.log(error);
    }
    next();
};

exports.getLiveNews = async (req, res, next) => {

    try {
        // get news update from economictimes
        var liveNews = await axios.get('https://economictimes.indiatimes.com/etstatic/liveblogs/msid-74880611,callback-liveBlogTypeALL-1.htm'); //?_=' + milliseconds);
        // process the news data
        liveNews = JSON.parse(liveNews.data.replace("liveBlogTypeALL (", "{ \"newsdata\":").replace(/.$/, "}"));

        req.liveNews = liveNews;
    } catch (error) {
        console.log(error);
    }
    next();
}

exports.getAbpVideos = async (req, res, next) => {

    var vidCount = 12;
    // if (count)
    //     vidcount = count;

    try {
        // get abp live videos
        var abpVideos = await axios.get(
            'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=' + vidCount +
            '&playlistId=UURWFSbif-RFENbBrSiez1DA' + '&key=' + process.env.YOUTUBE_API_KEY);

        // process the news data
        console.log('getAbpVideos', abpVideos.data);
        req.abpVideos = abpVideos;
    } catch (error) {
        console.log(error);
    }
    next();
}