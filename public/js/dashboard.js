var isAxiosLoading = false;
var newsPage = 1;

$(document).ready(function () {
    const loadButton = document.querySelector('.load-more');

    loadButton.addEventListener('click', function () {
        if (!isAxiosLoading) {
            $(".lds-roller").css("display", "block");
            $(".load-text").css("display", "none");
            isAxiosLoading = true;
            axios.get('/covid19/news/api?count=6&page=' + (newsPage + 1))
                .then(function (response) {
                    newsPage++;
                    if (response.data.length != 0)
                        isAxiosLoading = false;
                    else {
                        isAxiosLoading = true;
                    }

                    $(".lds-roller").css("display", "none");
                    $(".load-text").css("display", "block");

                    // console.log(response);
                    response.data.forEach(element => {
                        // console.log(element);
                        $(".news-grid").append(
                            `
                            <div class="col-sm-6 col-lg-4 mt-2 news-col">
                                <div class="tips-card smooth-transition">
                                    <a href = "` + element.url + `"
                                    target = "_blank" >
                                        <img class = "bg"
                                        alt = "` + element.title + `"
                                        src = "` + element.image + `">
                                        <div class="overlay-block h-100 w-100 smooth-transition">
                                            <h5>` + element.channel + `</h5>
                                            <h3 class="bold">` + element.title + `</h3 class="bold">
                                            <p>know more <span></span></p>
                                        </div>
                                        <h5>` + element.channel + `</h5>
                                        <h3 class="bold">` + element.title + `</h3 class="bold">
                                        <p>know more <span></span></p>
                                    </a>
                                </div>
                            </div>
                            `
                        );
                    });
                })
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        }
    });


});