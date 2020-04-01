step = 1;

$(document).ready(function () {

    // $(".show-donate").click(() => {
    //     $('#donateModel').modal('show');
    // });

    // Follow Insta button
    $("#insta_active").click(() => {
        $(".submit_next").attr('disabled', false);
        window.open('https://instagram.com/geexec', '_blank');
    })
    $("#insta_active_2").click(() => {
        $(".submit_next").attr('disabled', false);
        window.open('https://instagram.com/geexec', '_blank');
    })

    // Like Facebook Button 
    $("#fb_active").click(() => {
        $(".submit_next").attr('disabled', false);
        window.open('https://facebook.com/geexechq', '_blank');
    })
    $("#fb_active_2").click(() => {
        $(".submit_next").attr('disabled', false);
        window.open('https://facebook.com/geexechq', '_blank');
    })

    $(".submit_prev").click(() => {
        switch (step) {
            case 1:
                break;
            case 2:
                $(".submit_prev").addClass("step-hidden");
                $("#stepOne").removeClass("step-hidden");
                $("#stepTwo").addClass("step-hidden");
                $("#stepThree").addClass("step-hidden");
                step = 1;
                break;
            case 3:
                $("#stepOne").addClass("step-hidden");
                $("#stepTwo").removeClass("step-hidden");
                $("#stepThree").addClass("step-hidden");
                step = 2;
                break;
        }
    })

    $(".submit_next").click(() => {

        switch (step) {
            case 1:
                $(".submit_next").attr('disabled', true);
                $(".submit_prev").removeClass("step-hidden");
                $("#stepOne").addClass("step-hidden");
                $("#stepTwo").removeClass("step-hidden");
                $("#stepThree").addClass("step-hidden");
                step = 2;
                break;
            case 2:
                $("#stepOne").addClass("step-hidden");
                $("#stepTwo").addClass("step-hidden");
                $("#stepThree").removeClass("step-hidden");
                step = 3;
                break;
            case 3:
                if ($("#firstName").val().length < 1 ||
                    $("#lastName").val().length < 1 ||
                    $("#emailId").val().length < 1 ||
                    $("#instaId").val().length < 1 ||
                    $("#fbId").val().length < 1) {
                    $(".warnn").append(`
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                All fields are required
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`);
                } else if (!ValidateEmail($("#emailId").val())) {
                    $(".warnn").append(`
                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            ` + 'Please enter a valid email address' + `
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`);
                } else {
                    disableFields();
                    axios.post('/covid19/donate/addnew', {
                            first_name: $("#firstName").val(),
                            last_name: $("#lastName").val(),
                            email_id: $("#emailId").val(),
                            instagram_id: $("#instaId").val(),
                            facebook_id: $("#fbId").val(),
                            donator_fb_id: 'geexec',
                            donator_insta_id: 'geexechq',
                            donator_name: 'Geexec',
                            // captcha: token
                        })
                        .then(function (response) {
                            enableFields();
                            console.log(response);
                            if (response.data.status == 'success') {
                                $('#donateModel').modal('hide');
                                $('#thanksModel').modal({
                                    show: true
                                });
                            } else {
                                $(".warnn").append(`
                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            ` + response.data.messege + `
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`);
                            }
                        });
                }
                break;
            default:
                break;
        }
    })

    $(".fb").click(() => {
        FB.ui({
            method: 'share',
            href: 'http://donations.coronain.live',
        }, function (response) {});
    })

    // image popup
    $('.pop').on('click', function () {
        $('.imagepreview').attr('src', $(this).find('img').attr('src'));
        $('#viewImageModal').modal('show');
    });
});

$(window).on('load', function () {
    // code here

    $(".grecaptcha-badge").css("margin", "auto");
    $(".grecaptcha-badge").css("position", "inherit");
});

function disableFields() {
    $("#firstName").attr("disabled", true);
    $("#lastName").attr("disabled", true);
    $("#email").attr("disabled", true);
    $("#instaId").attr("disabled", true);
    $("#fbId").attr("disabled", true);
    $(".submit_button").attr("disabled", true);
    $(".submit_button").addClass("loading");

}

function enableFields() {
    $("#firstName").attr("disabled", false);
    $("#lastName").attr("disabled", false);
    $("#email").attr("disabled", false);
    $("#instaId").attr("disabled", false);
    $("#fbId").attr("disabled", false);
    $(".submit_button").attr("disabled", false);
    $(".submit_button").removeClass("loading");
}

function onSubmit(token) {
    console.log($(".sub-form").validate());
    axios.post('/covid19/donate/addnew', {
            firstName: 'Fred',
            lastName: 'Flintstone',
            captcha: token
        })
        .then(function (response) {
            console.log(response);
        });
    // alert('thanks ' + token);
}

function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    return (false)
}