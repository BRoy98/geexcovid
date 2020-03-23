// const axios = require('axios');
var isAxiosLoading = false;
var newsPage = 1;
var news = []

$(document).ready(function () {
    window.onscroll = function (ev) {
        if (isScrolledIntoView(document.getElementById("loading")) && !isAxiosLoading) {
            isAxiosLoading = true;
            axios.get('/covid19/news/api?page=' + (newsPage + 1))
                .then(function (response) {
                    newsPage++;
                    if (response.data.length != 0)
                        isAxiosLoading = false;
                    else {
                        isAxiosLoading = true;
                        $(".loading").css("display", "none");
                    }

                    // console.log(response);
                    response.data.forEach(element => {
                        // console.log(element);
                        $(".news-grid").append(
                            `
                            <div class="col-sm-6 col-lg-4 mt-2 news-col">
                            <div class="tips-card smooth-transition">
                                <a href = "` + element.url + `"
                                target = "_blank">
                                    <img class = "bg"
                                    alt = "` + element.title + `"
                                    src = "` + element.image + `" >
                                    <div class="overlay-block h-100 w-100 smooth-transition">
                                        <h5>` + element.channel + `</h5>
                                        <h3 class="bold">` + element.title + `</h3 class="bold">
                                        <div class="description">
                                            <p>` + element.description + `</p>
                                        </div>
                                        <p>know more <span></span></p>
                                    </div>
                                    <h5>` + element.channel + `</h5>
                                    <h3 class="bold">` + element.title + `</h3 class="bold">
                                    <div class="description">
                                        <p>` + element.description + `</p>
                                    </div>
                                    <p>know more <span></span></p>
                                </a>
                            </div>
                        </div>
                            `
                        );
                    });

                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        }
    };

});


function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}