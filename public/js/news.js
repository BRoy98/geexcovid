var isAxiosLoading = false;
var newsPage = 1;

$(document).ready(function () {
    window.onscroll = function (ev) {
        if (isScrolledIntoView(document.getElementById("loading")) && !isAxiosLoading) {
            isAxiosLoading = true;
            axios.get('/covid19/news/api?count=12&page=' + (newsPage + 1))
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
                            <div class="col-sm-12 col-lg-6 mt-2 news-col">
                                <div class="news-card-small collapsed">
                                    <a class="url"></a>
                                    <div class="thumb">
                                        <img class="bg" src="` + element.image + `" alt="` + element.title + `">
                                    </div>
                                    <div class="channel">
                                        ` + element.channel + `
                                    </div>
                                    <h4 class="title">
                                        <a href = "` + element.url + `">
                                            ` + element.title + `</a>
                                    </h4>
                                    <div class="mdi mdi-clock-outline time">
                                        <div> ` + moment(element.createdAt, "YYYY-MM-DDTHH:mm:ss").fromNow() + `</div>
                                    </div>
                                </div>
                            </div>
                            `
                        );
                    });

                    // console.log(response);
                })
                .catch(function (error) {
                    // console.log(error);
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