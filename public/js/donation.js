$(document).ready(function () {

    $(".grecaptcha-badge").css("margin", "auto");
    $(".grecaptcha-badge").css("position", "inherit");
    $(".submit_button").click(() => {
        console.log("Button Click");
        grecaptcha.execute();
    })
});

function onSubmit(token) {
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